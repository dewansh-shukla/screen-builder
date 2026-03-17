import { notFound } from "next/navigation";
import { getScreenMeta } from "@/lib/mockups";
import { MockupRenderer } from "./mockup-renderer";

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

export default async function MockupPage({ params }: PageProps) {
    const { slug } = await params;

    if (!slug || slug.length < 2) {
        notFound();
    }

    const [featureSlug, screenSlug] = slug;
    const meta = getScreenMeta(featureSlug, screenSlug);

    if (!meta) {
        notFound();
    }

    return <MockupRenderer featureSlug={featureSlug} screenSlug={screenSlug} />;
}
