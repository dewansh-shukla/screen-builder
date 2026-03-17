#!/usr/bin/env tsx
/**
 * sync-watch.ts
 *
 * Watches the source repo for changes and triggers incremental re-syncs.
 *
 * Usage:
 *   npx tsx scripts/sync-watch.ts
 */

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { watch, type FSWatcher } from "chokidar";
import { minimatch } from "minimatch";
import { stripApiFromFile } from "./api-stripper";

// ---------------------------------------------------------------------------
// ANSI colors (same as sync-main-app.ts)
// ---------------------------------------------------------------------------
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function log(msg: string) {
  console.log(msg);
}
function logSuccess(msg: string) {
  console.log(`${C.green}${msg}${C.reset}`);
}
function logWarn(msg: string) {
  console.log(`${C.yellow}${msg}${C.reset}`);
}
function logError(msg: string) {
  console.error(`${C.red}${msg}${C.reset}`);
}
function logInfo(msg: string) {
  console.log(`${C.cyan}${msg}${C.reset}`);
}
function logDim(msg: string) {
  console.log(`${C.dim}${msg}${C.reset}`);
}

// ---------------------------------------------------------------------------
// Types (duplicated from sync-main-app.ts to keep scripts independent)
// ---------------------------------------------------------------------------
interface SyncConfig {
  sourceRepo: string;
  sourcePath: string;
  components: { include: string[]; exclude: string[] };
  hooks: { include: string[]; exclude: string[] };
  targetMapping: Record<string, string>;
  apiPatterns: string[];
  importRemaps?: Record<string, string>;
}

interface ManifestFileEntry {
  hash: string;
  lastSynced: string;
  status: "synced" | "deleted" | "error";
  targetPath: string;
  warnings?: string[];
}

interface SyncManifest {
  lastSync: string | null;
  sourceCommit: string | null;
  files: Record<string, ManifestFileEntry>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const ROOT = path.resolve(__dirname, "..");

function readConfig(): SyncConfig {
  const configPath = path.join(ROOT, "sync-config.json");
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

function readManifest(): SyncManifest {
  const manifestPath = path.join(ROOT, "sync-manifest.json");
  if (!fs.existsSync(manifestPath)) {
    return { lastSync: null, sourceCommit: null, files: {} };
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}

function writeManifest(manifest: SyncManifest): void {
  const manifestPath = path.join(ROOT, "sync-manifest.json");
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
}

function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex");
}

function resolveTargetPath(
  sourceFile: string,
  targetMapping: Record<string, string>
): string {
  let bestPrefix = "";
  let bestTarget = "";

  for (const [srcPrefix, tgtPrefix] of Object.entries(targetMapping)) {
    if (
      sourceFile.startsWith(srcPrefix) &&
      srcPrefix.length > bestPrefix.length
    ) {
      bestPrefix = srcPrefix;
      bestTarget = tgtPrefix;
    }
  }

  if (!bestPrefix) {
    return path.join("src", "synced", sourceFile);
  }

  const relativePart = sourceFile.slice(bestPrefix.length);
  return path.join(bestTarget, relativePart);
}

/**
 * Check whether a file (relative to sourcePath) matches the include/exclude
 * patterns defined in the sync config.
 */
function isTrackedFile(relPath: string, config: SyncConfig): boolean {
  const matchesAny = (patterns: string[]) =>
    patterns.some((p) => minimatch(relPath, p));

  const inComponents =
    matchesAny(config.components.include) &&
    !matchesAny(config.components.exclude);
  const inHooks =
    matchesAny(config.hooks.include) && !matchesAny(config.hooks.exclude);

  return inComponents || inHooks;
}

// ---------------------------------------------------------------------------
// Incremental sync for a single file
// ---------------------------------------------------------------------------
function syncOneFile(
  relPath: string,
  config: SyncConfig,
  manifest: SyncManifest
): void {
  const fullSourcePath = path.join(config.sourcePath, relPath);
  const targetRelative = resolveTargetPath(relPath, config.targetMapping);
  const fullTargetPath = path.join(ROOT, targetRelative);

  if (!fs.existsSync(fullSourcePath)) {
    // File was deleted in source
    const entry = manifest.files[relPath];
    if (entry && entry.status !== "deleted") {
      logError(`  [Deleted] ${relPath}`);
      manifest.files[relPath] = {
        ...entry,
        status: "deleted",
        lastSynced: new Date().toISOString(),
      };
    }
    return;
  }

  const currentHash = hashFile(fullSourcePath);
  const existingEntry = manifest.files[relPath];

  // Skip unchanged
  if (
    existingEntry &&
    existingEntry.status !== "deleted" &&
    existingEntry.hash === currentHash
  ) {
    logDim(`  [Unchanged] ${relPath}`);
    return;
  }

  const isNew = !existingEntry || existingEntry.status === "deleted";
  const action = isNew ? "Added" : "Updated";

  try {
    const result = stripApiFromFile(fullSourcePath, fullTargetPath);

    const targetDir = path.dirname(fullTargetPath);
    fs.mkdirSync(targetDir, { recursive: true });

    fs.writeFileSync(fullTargetPath, result.transformed, "utf-8");

    const mockTargetPath = fullTargetPath.replace(/\.tsx?$/, ".mock.ts");
    if (result.mockFile.trim()) {
      fs.writeFileSync(mockTargetPath, result.mockFile, "utf-8");
    }

    manifest.files[relPath] = {
      hash: currentHash,
      lastSynced: new Date().toISOString(),
      status: "synced",
      targetPath: targetRelative,
      warnings: result.warnings.length > 0 ? result.warnings : undefined,
    };

    const color = isNew ? C.green : C.yellow;
    log(`  ${color}[${action}]${C.reset} ${relPath} -> ${targetRelative}`);
    for (const w of result.warnings) {
      logWarn(`    Warning: ${w}`);
    }
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    logError(`  [Error] ${relPath}: ${errMsg}`);
    manifest.files[relPath] = {
      hash: currentHash,
      lastSynced: new Date().toISOString(),
      status: "error",
      targetPath: targetRelative,
      warnings: [`Sync error: ${errMsg}`],
    };
  }
}

// ---------------------------------------------------------------------------
// Watcher
// ---------------------------------------------------------------------------
const DEBOUNCE_MS = 500;

function startWatcher(config: SyncConfig): FSWatcher {
  const manifest = readManifest();

  // Build the list of directories to watch from the include patterns.
  // We watch the top-level source directories that contain tracked files.
  const watchDirs = new Set<string>();
  const allIncludes = [
    ...config.components.include,
    ...config.hooks.include,
  ];

  for (const pattern of allIncludes) {
    // Extract the directory prefix before any glob characters
    const parts = pattern.split("/");
    const dirParts: string[] = [];
    for (const part of parts) {
      if (part.includes("*") || part.includes("?") || part.includes("{")) break;
      dirParts.push(part);
    }
    if (dirParts.length > 0) {
      const dir = path.join(config.sourcePath, dirParts.join("/"));
      if (fs.existsSync(dir)) {
        watchDirs.add(dir);
      }
    }
  }

  if (watchDirs.size === 0) {
    logError("No valid directories to watch. Check sync-config.json include patterns.");
    process.exit(1);
  }

  log(`${C.bold}${C.cyan}=== Screen Builder Sync Watcher ===${C.reset}\n`);
  logDim(`Source: ${config.sourcePath}`);
  logDim(`Watching ${watchDirs.size} directories:`);
  for (const dir of watchDirs) {
    logDim(`  ${dir}`);
  }
  log("");
  logInfo("Waiting for changes... (Ctrl+C to stop)\n");

  // Debounce: collect changed paths and flush after DEBOUNCE_MS of quiet time
  let pendingFiles = new Set<string>();
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;

  function flushChanges() {
    debounceTimer = null;
    const files = [...pendingFiles];
    pendingFiles = new Set();

    if (files.length === 0) return;

    const timestamp = new Date().toLocaleTimeString();
    log(
      `${C.bold}[${timestamp}]${C.reset} ${C.magenta}Change detected — syncing ${files.length} file(s)${C.reset}`
    );

    for (const relPath of files) {
      syncOneFile(relPath, config, manifest);
    }

    // Persist manifest
    manifest.lastSync = new Date().toISOString();
    writeManifest(manifest);
    log("");
    logInfo("Waiting for changes...\n");
  }

  function onFileChange(absPath: string) {
    // Compute path relative to sourcePath
    const relPath = path.relative(config.sourcePath, absPath);

    // Only process files that match our include/exclude rules
    if (!isTrackedFile(relPath, config)) return;

    pendingFiles.add(relPath);

    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(flushChanges, DEBOUNCE_MS);
  }

  const watcher = watch([...watchDirs], {
    ignoreInitial: true,
    ignored: [
      /(^|[/\\])\./,           // dotfiles
      /node_modules/,
      /\.git/,
    ],
    persistent: true,
    awaitWriteFinish: {
      stabilityThreshold: 200,
      pollInterval: 50,
    },
  });

  watcher
    .on("add", onFileChange)
    .on("change", onFileChange)
    .on("unlink", onFileChange);

  return watcher;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
function main(): void {
  let config: SyncConfig;
  try {
    config = readConfig();
  } catch (err) {
    logError(`Failed to load config: ${(err as Error).message}`);
    process.exit(1);
  }

  if (!fs.existsSync(config.sourcePath)) {
    logError(
      `Source repo not found at ${config.sourcePath}. Run "npm run sync" first.`
    );
    process.exit(1);
  }

  const watcher = startWatcher(config);

  // Graceful shutdown
  function shutdown() {
    log(`\n${C.dim}Shutting down watcher...${C.reset}`);
    watcher.close().then(() => {
      logSuccess("Watcher stopped.");
      process.exit(0);
    });
  }

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
