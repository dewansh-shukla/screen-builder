"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

interface MockupRendererProps {
    featureSlug: string;
    screenSlug: string;
}

const screenModules: Record<string, ReturnType<typeof dynamic>> = {};

function getScreen(featureSlug: string, screenSlug: string) {
    const key = `${featureSlug}/${screenSlug}`;
    if (!screenModules[key]) {
        screenModules[key] = dynamic(
            () => import(`../../../../mockups/${featureSlug}/${screenSlug}/current`),
            { ssr: false },
        );
    }
    return screenModules[key];
}

export function MockupRenderer({ featureSlug, screenSlug }: MockupRendererProps) {
    const Screen = useMemo(
        () => getScreen(featureSlug, screenSlug),
        [featureSlug, screenSlug],
    );

    return <Screen />;
}
