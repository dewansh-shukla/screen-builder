import { ArrowRight, LayersThree01, Monitor04 } from "@untitledui/icons";
import Link from "next/link";
import { getAllFeatures } from "@/lib/mockups";

const statusColors: Record<string, string> = {
    draft: "bg-quaternary",
    review: "bg-warning-solid",
    approved: "bg-success-solid",
    "handed-off": "bg-brand-solid",
};

const statusLabels: Record<string, string> = {
    draft: "Draft",
    review: "In Review",
    approved: "Approved",
    "handed-off": "Handed Off",
};

export const dynamic = "force-dynamic";

export default function HomePage() {
    const features = getAllFeatures();
    const totalScreens = features.reduce(
        (sum, f) => sum + f.screens.length,
        0,
    );

    return (
        <div className="min-h-dvh bg-primary">
            <div className="border-b border-secondary">
                <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-secondary">
                            <Monitor04 className="size-5 text-fg-brand-primary" />
                        </div>
                        <div>
                            <h1 className="text-display-xs font-semibold text-primary">
                                Screen Builder
                            </h1>
                            <p className="text-sm text-tertiary">
                                {features.length} feature{features.length !== 1 ? "s" : ""} &middot; {totalScreens} screen{totalScreens !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                {features.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="flex size-12 items-center justify-center rounded-lg bg-secondary">
                            <LayersThree01 className="size-6 text-fg-quaternary" />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-primary">
                            No screens yet
                        </h2>
                        <p className="mt-1 max-w-sm text-sm text-tertiary">
                            Open Claude Code and describe a screen to get started. For example: &ldquo;Create a guest list page with search and filters&rdquo;
                        </p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {features.map((feature) => (
                            <div key={feature.slug}>
                                <div className="mb-3">
                                    <h2 className="text-lg font-semibold text-primary">
                                        {feature.meta.name}
                                    </h2>
                                    {feature.meta.description && (
                                        <p className="mt-0.5 text-sm text-tertiary">
                                            {feature.meta.description}
                                        </p>
                                    )}
                                </div>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                    {feature.screens.map((screen) => (
                                        <Link
                                            key={screen.slug}
                                            href={`/mockups/${feature.slug}/${screen.slug}`}
                                            className="group rounded-xl border border-secondary p-4 transition duration-100 ease-linear hover:border-brand hover:shadow-xs"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate font-medium text-primary">
                                                        {screen.meta.name}
                                                    </h3>
                                                    <p className="mt-0.5 line-clamp-2 text-sm text-tertiary">
                                                        {screen.meta.description}
                                                    </p>
                                                </div>
                                                <ArrowRight className="ml-2 mt-0.5 size-4 shrink-0 text-fg-quaternary opacity-0 transition duration-100 ease-linear group-hover:opacity-100" />
                                            </div>
                                            <div className="mt-3 flex items-center gap-2">
                                                <span
                                                    className={`size-2 rounded-full ${statusColors[screen.meta.status] ?? "bg-quaternary"}`}
                                                />
                                                <span className="text-xs text-tertiary">
                                                    {statusLabels[screen.meta.status] ?? screen.meta.status}
                                                </span>
                                                <span className="text-xs text-quaternary">
                                                    &middot; v{screen.meta.version}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
