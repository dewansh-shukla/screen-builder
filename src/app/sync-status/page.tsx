import * as fs from "fs";
import * as path from "path";
import {
    RefreshCw05,
    CheckCircle,
    AlertTriangle,
    Trash01,
    File06,
    FolderClosed,
    Clock,
    GitCommit,
} from "@untitledui/icons";
import { Badge, BadgeWithDot } from "@/components/base/badges/badges";
import { Card } from "@/components/base/card/card";

// ---------------------------------------------------------------------------
// Types (mirrors sync-main-app.ts manifest shape)
// ---------------------------------------------------------------------------
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
// Data loading (build-time via fs)
// ---------------------------------------------------------------------------
function loadManifest(): SyncManifest | null {
    const manifestPath = path.join(process.cwd(), "sync-manifest.json");
    if (!fs.existsSync(manifestPath)) return null;
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}

function groupFilesByDirectory(
    files: Record<string, ManifestFileEntry>,
): Record<string, { source: string; entry: ManifestFileEntry }[]> {
    const groups: Record<
        string,
        { source: string; entry: ManifestFileEntry }[]
    > = {};
    for (const [source, entry] of Object.entries(files)) {
        const dir = path.dirname(entry.targetPath);
        if (!groups[dir]) groups[dir] = [];
        groups[dir].push({ source, entry });
    }
    // Sort groups by directory name and files within each group
    const sorted: typeof groups = {};
    for (const key of Object.keys(groups).sort()) {
        sorted[key] = groups[key].sort((a, b) =>
            a.source.localeCompare(b.source),
        );
    }
    return sorted;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function StatCard({
    label,
    value,
    icon: Icon,
    color,
}: {
    label: string;
    value: number;
    icon: React.FC<{ className?: string }>;
    color: "success" | "error" | "warning" | "brand" | "gray";
}) {
    const iconColorMap = {
        success: "text-fg-success-primary",
        error: "text-fg-error-primary",
        warning: "text-fg-warning-primary",
        brand: "text-fg-brand-primary",
        gray: "text-fg-quaternary",
    };
    const bgMap = {
        success: "bg-success-secondary",
        error: "bg-error-secondary",
        warning: "bg-warning-secondary",
        brand: "bg-brand-secondary",
        gray: "bg-secondary",
    };

    return (
        <Card className="p-5">
            <div className="flex items-center gap-3">
                <div
                    className={`flex size-10 items-center justify-center rounded-lg ${bgMap[color]}`}
                >
                    <Icon className={`size-5 ${iconColorMap[color]}`} />
                </div>
                <div>
                    <p className="text-sm text-tertiary">{label}</p>
                    <p className="text-display-xs font-semibold text-primary">
                        {value}
                    </p>
                </div>
            </div>
        </Card>
    );
}

function StatusBadge({ status }: { status: ManifestFileEntry["status"] }) {
    const colorMap = {
        synced: "success" as const,
        error: "error" as const,
        deleted: "gray" as const,
    };
    const labelMap = {
        synced: "Synced",
        error: "Error",
        deleted: "Deleted",
    };
    return (
        <BadgeWithDot size="sm" color={colorMap[status]}>
            {labelMap[status]}
        </BadgeWithDot>
    );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

/** Force dynamic rendering so we always read the latest manifest from disk */
export const dynamic = "force-dynamic";

export default function SyncStatusPage() {
    const manifest = loadManifest();

    if (!manifest) {
        return (
            <div className="min-h-dvh bg-primary">
                <div className="border-b border-secondary">
                    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                        <PageHeader />
                    </div>
                </div>
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <EmptyManifest />
                </div>
            </div>
        );
    }

    const entries = Object.values(manifest.files);
    const syncedCount = entries.filter((e) => e.status === "synced").length;
    const errorCount = entries.filter((e) => e.status === "error").length;
    const deletedCount = entries.filter((e) => e.status === "deleted").length;
    const filesWithWarnings = Object.entries(manifest.files).filter(
        ([, e]) => e.warnings && e.warnings.length > 0,
    );
    const grouped = groupFilesByDirectory(manifest.files);
    const commitShort = manifest.sourceCommit?.slice(0, 7) ?? null;

    return (
        <div className="min-h-dvh bg-primary">
            {/* Header */}
            <div className="border-b border-secondary">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <PageHeader />
                </div>
            </div>

            <div className="mx-auto max-w-5xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                {/* Sync metadata */}
                <div className="flex flex-wrap items-center gap-4 text-sm">
                    {manifest.lastSync && (
                        <div className="flex items-center gap-1.5 text-tertiary">
                            <Clock className="size-4 text-fg-quaternary" />
                            <span>Last sync: {formatDate(manifest.lastSync)}</span>
                        </div>
                    )}
                    {manifest.sourceCommit && (
                        <div className="flex items-center gap-1.5 text-tertiary">
                            <GitCommit className="size-4 text-fg-quaternary" />
                            <span>Source:</span>
                            <a
                                href={`https://github.com/commerce56/zapigowebclient/commit/${manifest.sourceCommit}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-brand-primary transition duration-100 ease-linear hover:underline"
                            >
                                {commitShort}
                            </a>
                        </div>
                    )}
                </div>

                {/* Stats cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        label="Total files"
                        value={entries.length}
                        icon={File06}
                        color="brand"
                    />
                    <StatCard
                        label="Synced"
                        value={syncedCount}
                        icon={CheckCircle}
                        color="success"
                    />
                    <StatCard
                        label="Errors"
                        value={errorCount}
                        icon={AlertTriangle}
                        color="error"
                    />
                    <StatCard
                        label="Deleted"
                        value={deletedCount}
                        icon={Trash01}
                        color="gray"
                    />
                </div>

                {/* Warnings section */}
                {filesWithWarnings.length > 0 && (
                    <section>
                        <h2 className="mb-3 text-lg font-semibold text-primary">
                            Warnings ({filesWithWarnings.length} files need manual review)
                        </h2>
                        <Card>
                            <div className="divide-y divide-secondary">
                                {filesWithWarnings.map(([source, entry]) => (
                                    <div key={source} className="px-5 py-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <p className="font-mono text-sm font-medium text-primary">
                                                {entry.targetPath}
                                            </p>
                                            <Badge size="sm" color="warning">
                                                {entry.warnings!.length} warning
                                                {entry.warnings!.length !== 1 ? "s" : ""}
                                            </Badge>
                                        </div>
                                        <ul className="mt-2 space-y-1">
                                            {entry.warnings!.map((w, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-2 text-sm text-tertiary"
                                                >
                                                    <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-fg-warning-primary" />
                                                    <span>{w}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </section>
                )}

                {/* All files grouped by directory */}
                <section>
                    <h2 className="mb-3 text-lg font-semibold text-primary">
                        All synced files
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(grouped).map(([dir, files]) => (
                            <Card key={dir}>
                                <div className="flex items-center gap-2 border-b border-secondary px-5 py-3">
                                    <FolderClosed className="size-4 text-fg-quaternary" />
                                    <h3 className="font-mono text-sm font-medium text-secondary">
                                        {dir}
                                    </h3>
                                    <span className="text-xs text-quaternary">
                                        ({files.length})
                                    </span>
                                </div>
                                <div className="divide-y divide-secondary">
                                    {files.map(({ source, entry }) => {
                                        const fileName = path.basename(
                                            entry.targetPath,
                                        );
                                        return (
                                            <div
                                                key={source}
                                                className="flex items-center justify-between gap-3 px-5 py-2.5"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate font-mono text-sm text-primary">
                                                        {fileName}
                                                    </p>
                                                    <p className="truncate text-xs text-quaternary">
                                                        {source}
                                                    </p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-2">
                                                    {entry.warnings &&
                                                        entry.warnings.length > 0 && (
                                                            <Badge
                                                                size="sm"
                                                                color="warning"
                                                            >
                                                                {entry.warnings.length}w
                                                            </Badge>
                                                        )}
                                                    <StatusBadge
                                                        status={entry.status}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Extracted pieces
// ---------------------------------------------------------------------------
function PageHeader() {
    return (
        <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-brand-secondary">
                <RefreshCw05 className="size-5 text-fg-brand-primary" />
            </div>
            <div>
                <h1 className="text-display-xs font-semibold text-primary">
                    Sync Status
                </h1>
                <p className="text-sm text-tertiary">
                    Component sync from zapigowebclient
                </p>
            </div>
        </div>
    );
}

function EmptyManifest() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex size-12 items-center justify-center rounded-lg bg-secondary">
                <RefreshCw05 className="size-6 text-fg-quaternary" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-primary">
                No sync data
            </h2>
            <p className="mt-1 max-w-sm text-sm text-tertiary">
                Run the sync script to generate sync-manifest.json:
            </p>
            <code className="mt-3 rounded-lg border border-secondary bg-secondary px-4 py-2 font-mono text-sm text-primary">
                npm run sync
            </code>
        </div>
    );
}
