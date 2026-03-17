import fs from "fs";
import path from "path";

const MOCKUPS_DIR = path.join(process.cwd(), "mockups");

export interface ScreenMeta {
    name: string;
    description: string;
    status: "draft" | "review" | "approved" | "handed-off";
    components: string[];
    devNotes: string;
    createdAt: string;
    updatedAt: string;
    version: number;
}

export interface FeatureMeta {
    name: string;
    description: string;
    screens: string[];
}

export interface FeatureWithScreens {
    slug: string;
    meta: FeatureMeta;
    screens: {
        slug: string;
        meta: ScreenMeta;
    }[];
}

function readJson<T>(filePath: string): T | null {
    try {
        const content = fs.readFileSync(filePath, "utf-8");
        return JSON.parse(content) as T;
    } catch {
        return null;
    }
}

export function getAllFeatures(): FeatureWithScreens[] {
    const index = readJson<{ features: string[] }>(
        path.join(MOCKUPS_DIR, "_index.json"),
    );
    if (!index) return [];

    return index.features
        .map((featureSlug) => {
            const featureDir = path.join(MOCKUPS_DIR, featureSlug);
            const featureMeta = readJson<FeatureMeta>(
                path.join(featureDir, "_feature.json"),
            );
            if (!featureMeta) return null;

            const screens = featureMeta.screens
                .map((screenSlug) => {
                    const screenMeta = readJson<ScreenMeta>(
                        path.join(featureDir, screenSlug, "_screen.json"),
                    );
                    if (!screenMeta) return null;
                    return { slug: screenSlug, meta: screenMeta };
                })
                .filter(Boolean) as { slug: string; meta: ScreenMeta }[];

            return {
                slug: featureSlug,
                meta: featureMeta,
                screens,
            };
        })
        .filter(Boolean) as FeatureWithScreens[];
}

export function getScreenMeta(
    featureSlug: string,
    screenSlug: string,
): ScreenMeta | null {
    return readJson<ScreenMeta>(
        path.join(MOCKUPS_DIR, featureSlug, screenSlug, "_screen.json"),
    );
}
