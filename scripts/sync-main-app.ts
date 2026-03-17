#!/usr/bin/env tsx
/**
 * sync-main-app.ts
 *
 * Main orchestration script for syncing components from the Zapigo main app
 * (zapigowebclient) into screen-builder, stripping API integrations in the process.
 *
 * Usage:
 *   npx tsx scripts/sync-main-app.ts              # Full sync
 *   npx tsx scripts/sync-main-app.ts --dry-run     # Preview changes
 *   npx tsx scripts/sync-main-app.ts --force        # Re-sync all files
 *   npx tsx scripts/sync-main-app.ts --clean        # Remove deleted files
 *   npx tsx scripts/sync-main-app.ts --diff         # Show changes since last sync
 */

import * as crypto from "crypto";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { minimatch } from "minimatch";
import { stripApiFromFile } from "./api-stripper";

// ---------------------------------------------------------------------------
// ANSI colors
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
// Types
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

interface SyncStats {
  added: number;
  updated: number;
  unchanged: number;
  deleted: number;
  errors: number;
  warnings: string[];
}

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------
function parseArgs(): {
  dryRun: boolean;
  force: boolean;
  clean: boolean;
  diff: boolean;
} {
  const args = process.argv.slice(2);
  return {
    dryRun: args.includes("--dry-run"),
    force: args.includes("--force"),
    clean: args.includes("--clean"),
    diff: args.includes("--diff"),
  };
}

// ---------------------------------------------------------------------------
// File hashing
// ---------------------------------------------------------------------------
function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex");
}

function hashString(content: string): string {
  return crypto.createHash("md5").update(content).digest("hex");
}

// ---------------------------------------------------------------------------
// Config & manifest helpers
// ---------------------------------------------------------------------------
const ROOT = path.resolve(__dirname, "..");

function readConfig(): SyncConfig {
  const configPath = path.join(ROOT, "sync-config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`sync-config.json not found at ${configPath}`);
  }
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

// ---------------------------------------------------------------------------
// Source repo management
// ---------------------------------------------------------------------------
function ensureSourceRepo(config: SyncConfig): void {
  const { sourcePath, sourceRepo } = config;

  if (fs.existsSync(sourcePath)) {
    log(`${C.dim}Source repo exists at ${sourcePath}, pulling latest...${C.reset}`);
    try {
      execSync("git pull --ff-only", {
        cwd: sourcePath,
        stdio: "pipe",
      });
      logSuccess("  Source repo updated.");
    } catch (err) {
      logWarn(
        "  Warning: git pull failed. Proceeding with current state."
      );
      logDim(`  ${(err as Error).message}`);
    }
  } else {
    log(`Source repo not found at ${sourcePath}, cloning...`);
    try {
      execSync(`git clone --depth 1 ${sourceRepo} "${sourcePath}"`, {
        stdio: "pipe",
      });
      logSuccess(`  Cloned to ${sourcePath}`);
    } catch (err) {
      throw new Error(
        `Failed to clone source repo: ${(err as Error).message}`
      );
    }
  }
}

function getSourceCommit(sourcePath: string): string | null {
  try {
    return execSync("git rev-parse HEAD", {
      cwd: sourcePath,
      encoding: "utf-8",
    }).trim();
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------
function discoverFiles(
  sourcePath: string,
  includes: string[],
  excludes: string[]
): string[] {
  const allFiles: Set<string> = new Set();

  for (const pattern of includes) {
    const matches = glob.sync(pattern, {
      cwd: sourcePath,
      nodir: true,
    });
    for (const m of matches) {
      allFiles.add(m);
    }
  }

  // Apply exclusions
  const filtered = [...allFiles].filter((file) => {
    return !excludes.some((exPattern) => minimatch(file, exPattern));
  });

  return filtered.sort();
}

function discoverAllFiles(config: SyncConfig): string[] {
  const { sourcePath } = config;
  const componentFiles = discoverFiles(
    sourcePath,
    config.components.include,
    config.components.exclude
  );
  const hookFiles = discoverFiles(
    sourcePath,
    config.hooks.include,
    config.hooks.exclude
  );
  return [...componentFiles, ...hookFiles];
}

// ---------------------------------------------------------------------------
// Target path resolution
// ---------------------------------------------------------------------------
function resolveTargetPath(
  sourceFile: string,
  targetMapping: Record<string, string>
): string {
  // Find the longest matching prefix in targetMapping
  let bestPrefix = "";
  let bestTarget = "";

  for (const [srcPrefix, tgtPrefix] of Object.entries(targetMapping)) {
    if (sourceFile.startsWith(srcPrefix) && srcPrefix.length > bestPrefix.length) {
      bestPrefix = srcPrefix;
      bestTarget = tgtPrefix;
    }
  }

  if (!bestPrefix) {
    // Fallback: place under src/synced/
    return path.join("src", "synced", sourceFile);
  }

  const relativePart = sourceFile.slice(bestPrefix.length);
  return path.join(bestTarget, relativePart);
}

// ---------------------------------------------------------------------------
// Diff display
// ---------------------------------------------------------------------------
function showDiff(
  config: SyncConfig,
  manifest: SyncManifest
): void {
  const sourceFiles = discoverAllFiles(config);
  const manifestFiles = new Set(Object.keys(manifest.files));

  const added: string[] = [];
  const changed: string[] = [];
  const deleted: string[] = [];
  const unchanged: string[] = [];

  for (const file of sourceFiles) {
    const entry = manifest.files[file];
    if (!entry) {
      added.push(file);
      continue;
    }
    if (entry.status === "deleted") {
      added.push(file);
      continue;
    }

    const fullPath = path.join(config.sourcePath, file);
    if (!fs.existsSync(fullPath)) continue;

    const currentHash = hashFile(fullPath);
    if (currentHash !== entry.hash) {
      changed.push(file);
    } else {
      unchanged.push(file);
    }
  }

  // Files in manifest but not in source
  for (const file of manifestFiles) {
    if (
      !sourceFiles.includes(file) &&
      manifest.files[file].status !== "deleted"
    ) {
      deleted.push(file);
    }
  }

  log(`\n${C.bold}Changes since last sync:${C.reset}`);
  log(`${C.dim}Last sync: ${manifest.lastSync ?? "never"}${C.reset}`);
  log(`${C.dim}Source commit: ${manifest.sourceCommit ?? "unknown"}${C.reset}\n`);

  if (added.length > 0) {
    logSuccess(`  + Added (${added.length}):`);
    for (const f of added) logSuccess(`    ${f}`);
  }
  if (changed.length > 0) {
    logWarn(`  ~ Changed (${changed.length}):`);
    for (const f of changed) logWarn(`    ${f}`);
  }
  if (deleted.length > 0) {
    logError(`  - Deleted (${deleted.length}):`);
    for (const f of deleted) logError(`    ${f}`);
  }
  if (unchanged.length > 0) {
    logDim(`  = Unchanged: ${unchanged.length} files`);
  }

  if (added.length === 0 && changed.length === 0 && deleted.length === 0) {
    logInfo("\n  No changes detected.");
  }

  log("");
}

// ---------------------------------------------------------------------------
// Main sync logic
// ---------------------------------------------------------------------------
async function syncFiles(
  config: SyncConfig,
  manifest: SyncManifest,
  flags: { dryRun: boolean; force: boolean; clean: boolean }
): Promise<SyncStats> {
  const stats: SyncStats = {
    added: 0,
    updated: 0,
    unchanged: 0,
    deleted: 0,
    errors: 0,
    warnings: [],
  };

  const sourceFiles = discoverAllFiles(config);
  const manifestFileSet = new Set(Object.keys(manifest.files));
  const processedFiles = new Set<string>();

  log(
    `\n${C.bold}Discovered ${sourceFiles.length} files to sync.${C.reset}\n`
  );

  // Process each source file
  for (const file of sourceFiles) {
    processedFiles.add(file);
    const fullSourcePath = path.join(config.sourcePath, file);
    const targetRelative = resolveTargetPath(file, config.targetMapping);
    const fullTargetPath = path.join(ROOT, targetRelative);

    if (!fs.existsSync(fullSourcePath)) {
      logWarn(`  Skip (missing): ${file}`);
      continue;
    }

    const currentHash = hashFile(fullSourcePath);
    const existingEntry = manifest.files[file];

    // Check if file is unchanged (unless --force)
    if (
      !flags.force &&
      existingEntry &&
      existingEntry.status !== "deleted" &&
      existingEntry.hash === currentHash
    ) {
      stats.unchanged++;
      continue;
    }

    const isNew = !existingEntry || existingEntry.status === "deleted";
    const action = isNew ? "Added" : "Updated";

    if (flags.dryRun) {
      const color = isNew ? C.green : C.yellow;
      log(`  ${color}[${action}]${C.reset} ${file} -> ${targetRelative}`);
      if (isNew) stats.added++;
      else stats.updated++;
      continue;
    }

    // Transform and write the file
    try {
      const mockTargetPath = fullTargetPath.replace(/\.tsx?$/, ".mock.ts");

      const result = stripApiFromFile(fullSourcePath, fullTargetPath);

      // Ensure target directory exists
      const targetDir = path.dirname(fullTargetPath);
      fs.mkdirSync(targetDir, { recursive: true });

      // Write transformed file
      fs.writeFileSync(fullTargetPath, result.transformed, "utf-8");

      // Write mock companion file
      if (result.mockFile.trim()) {
        fs.writeFileSync(mockTargetPath, result.mockFile, "utf-8");
      }

      // Update manifest entry
      manifest.files[file] = {
        hash: currentHash,
        lastSynced: new Date().toISOString(),
        status: "synced",
        targetPath: targetRelative,
        warnings:
          result.warnings.length > 0 ? result.warnings : undefined,
      };

      if (result.warnings.length > 0) {
        for (const w of result.warnings) {
          stats.warnings.push(`${file}: ${w}`);
        }
      }

      const color = isNew ? C.green : C.yellow;
      log(`  ${color}[${action}]${C.reset} ${file}`);
      if (result.warnings.length > 0) {
        for (const w of result.warnings) {
          logWarn(`    Warning: ${w}`);
        }
      }

      if (isNew) stats.added++;
      else stats.updated++;
    } catch (err) {
      stats.errors++;
      const errMsg = err instanceof Error ? err.message : String(err);
      logError(`  [Error] ${file}: ${errMsg}`);

      // Record the error in manifest so we don't silently lose track
      manifest.files[file] = {
        hash: currentHash,
        lastSynced: new Date().toISOString(),
        status: "error",
        targetPath: targetRelative,
        warnings: [`Sync error: ${errMsg}`],
      };
    }
  }

  // Handle deleted files (in manifest but no longer in source)
  for (const file of manifestFileSet) {
    if (processedFiles.has(file)) continue;
    if (manifest.files[file].status === "deleted") continue;

    stats.deleted++;
    const entry = manifest.files[file];

    if (flags.dryRun) {
      logError(`  [Deleted] ${file}`);
      continue;
    }

    if (flags.clean) {
      // Remove target files
      const fullTargetPath = path.join(ROOT, entry.targetPath);
      const mockPath = fullTargetPath.replace(/\.tsx?$/, ".mock.ts");

      if (fs.existsSync(fullTargetPath)) {
        fs.unlinkSync(fullTargetPath);
        logError(`  [Deleted] ${file} (removed ${entry.targetPath})`);
      }
      if (fs.existsSync(mockPath)) {
        fs.unlinkSync(mockPath);
      }

      // Try to clean up empty parent dirs
      try {
        let dir = path.dirname(fullTargetPath);
        while (dir !== ROOT && dir.startsWith(ROOT)) {
          const entries = fs.readdirSync(dir);
          if (entries.length === 0) {
            fs.rmdirSync(dir);
            dir = path.dirname(dir);
          } else {
            break;
          }
        }
      } catch {
        // Ignore cleanup errors
      }
    } else {
      logWarn(`  [Deleted in source] ${file} (use --clean to remove)`);
    }

    manifest.files[file] = {
      ...entry,
      status: "deleted",
      lastSynced: new Date().toISOString(),
    };
  }

  return stats;
}

// ---------------------------------------------------------------------------
// Summary output
// ---------------------------------------------------------------------------
function printSummary(stats: SyncStats, dryRun: boolean): void {
  const prefix = dryRun ? "Dry run summary" : "Sync complete";

  log(`\n${C.bold}${prefix}:${C.reset}`);
  log(`  ${C.green}Added:${C.reset}     ${stats.added} files`);
  log(`  ${C.yellow}Updated:${C.reset}   ${stats.updated} files`);
  log(`  ${C.dim}Unchanged:${C.reset} ${stats.unchanged} files`);
  log(`  ${C.red}Deleted:${C.reset}   ${stats.deleted} files`);
  if (stats.errors > 0) {
    log(`  ${C.red}Errors:${C.reset}    ${stats.errors} files`);
  }
  if (stats.warnings.length > 0) {
    log(
      `  ${C.yellow}Warnings:${C.reset}  ${stats.warnings.length} files need manual review`
    );
    log("");
    for (const w of stats.warnings) {
      logWarn(`    - ${w}`);
    }
  }
  log("");
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
async function main(): Promise<void> {
  const flags = parseArgs();

  log(`${C.bold}${C.cyan}=== Screen Builder Sync ===${C.reset}`);
  log("");

  if (flags.dryRun) logInfo("  Mode: DRY RUN (no files will be written)");
  if (flags.force) logInfo("  Mode: FORCE (ignoring file hashes)");
  if (flags.clean) logInfo("  Mode: CLEAN (removing deleted files)");
  if (flags.diff) logInfo("  Mode: DIFF (showing changes only)");
  log("");

  // 1. Read config
  let config: SyncConfig;
  try {
    config = readConfig();
    logDim(`Config loaded. Source: ${config.sourcePath}`);
  } catch (err) {
    logError(`Failed to load config: ${(err as Error).message}`);
    process.exit(1);
  }

  // 2. Read manifest
  const manifest = readManifest();
  logDim(
    `Manifest loaded. Last sync: ${manifest.lastSync ?? "never"}, tracked files: ${Object.keys(manifest.files).length}`
  );

  // 3. Ensure source repo is available
  ensureSourceRepo(config);

  // 4. Diff-only mode
  if (flags.diff) {
    showDiff(config, manifest);
    return;
  }

  // 5. Run the sync
  const stats = await syncFiles(config, manifest, flags);

  // 6. Update manifest metadata (skip for dry run)
  if (!flags.dryRun) {
    manifest.lastSync = new Date().toISOString();
    manifest.sourceCommit = getSourceCommit(config.sourcePath);
    writeManifest(manifest);
    logDim(`Manifest saved. Commit: ${manifest.sourceCommit ?? "unknown"}`);
  }

  // 7. Print summary
  printSummary(stats, flags.dryRun);

  // Exit with error code if there were failures
  if (stats.errors > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  logError(`Fatal error: ${err.message ?? err}`);
  process.exit(1);
});
