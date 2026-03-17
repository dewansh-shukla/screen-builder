#!/usr/bin/env tsx
/**
 * sync-ci.ts
 *
 * CI / pre-commit check: verifies that synced files are up-to-date with the
 * source repo. Exits with code 1 if any files need re-syncing.
 *
 * Usage:
 *   npx tsx scripts/sync-ci.ts
 */

import * as crypto from "crypto";
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";
import { minimatch } from "minimatch";

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
  cyan: "\x1b[36m",
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

function hashFile(filePath: string): string {
  const content = fs.readFileSync(filePath);
  return crypto.createHash("md5").update(content).digest("hex");
}

function discoverFiles(
  sourcePath: string,
  includes: string[],
  excludes: string[]
): string[] {
  const allFiles = new Set<string>();

  for (const pattern of includes) {
    const matches = glob.sync(pattern, { cwd: sourcePath, nodir: true });
    for (const m of matches) allFiles.add(m);
  }

  return [...allFiles]
    .filter((file) => !excludes.some((p) => minimatch(file, p)))
    .sort();
}

function discoverAllFiles(config: SyncConfig): string[] {
  const componentFiles = discoverFiles(
    config.sourcePath,
    config.components.include,
    config.components.exclude
  );
  const hookFiles = discoverFiles(
    config.sourcePath,
    config.hooks.include,
    config.hooks.exclude
  );
  return [...componentFiles, ...hookFiles];
}

// ---------------------------------------------------------------------------
// Check
// ---------------------------------------------------------------------------
function checkSync(config: SyncConfig, manifest: SyncManifest): boolean {
  const sourceFiles = discoverAllFiles(config);
  const manifestFiles = new Set(Object.keys(manifest.files));

  const added: string[] = [];
  const changed: string[] = [];
  const deleted: string[] = [];

  for (const file of sourceFiles) {
    const entry = manifest.files[file];
    if (!entry || entry.status === "deleted") {
      added.push(file);
      continue;
    }

    const fullPath = path.join(config.sourcePath, file);
    if (!fs.existsSync(fullPath)) continue;

    const currentHash = hashFile(fullPath);
    if (currentHash !== entry.hash) {
      changed.push(file);
    }
  }

  for (const file of manifestFiles) {
    if (
      !sourceFiles.includes(file) &&
      manifest.files[file].status !== "deleted"
    ) {
      deleted.push(file);
    }
  }

  const totalOutdated = added.length + changed.length + deleted.length;

  // Print summary
  log(`${C.bold}${C.cyan}=== Sync CI Check ===${C.reset}\n`);
  logDim(`Source: ${config.sourcePath}`);
  logDim(`Last sync: ${manifest.lastSync ?? "never"}`);
  logDim(`Source files: ${sourceFiles.length}`);
  logDim(`Tracked in manifest: ${manifestFiles.size}`);
  log("");

  if (totalOutdated === 0) {
    logSuccess("All synced files are up-to-date.");
    log("");
    return true;
  }

  logError(`${totalOutdated} file(s) are outdated and need re-syncing:\n`);

  if (added.length > 0) {
    logSuccess(`  + New files (${added.length}):`);
    for (const f of added) logSuccess(`    ${f}`);
  }
  if (changed.length > 0) {
    logWarn(`  ~ Changed files (${changed.length}):`);
    for (const f of changed) logWarn(`    ${f}`);
  }
  if (deleted.length > 0) {
    logError(`  - Deleted from source (${deleted.length}):`);
    for (const f of deleted) logError(`    ${f}`);
  }

  log("");
  logError(`Run "npm run sync" to update synced files.`);
  log("");

  return false;
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
      `Source repo not found at ${config.sourcePath}.\n` +
        `  Set up the source repo first with "npm run sync".`
    );
    process.exit(1);
  }

  const manifest = readManifest();
  const upToDate = checkSync(config, manifest);

  process.exit(upToDate ? 0 : 1);
}

main();
