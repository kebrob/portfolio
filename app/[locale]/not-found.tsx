import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ThemedPage from "@/components/ThemedPage";
import NotFoundPage from "@/components/not-found/NotFoundPage";

/*
 * The 404, wrapped in the same themed shell as the archive and the project
 * pages, so the paper/ink toggle works here and the nav picks up the right
 * colour.
 */
export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("notFound");
    return { title: t("metaTitle") };
}

export default function NotFound() {
    return (
        <ThemedPage>
            <NotFoundPage />
        </ThemedPage>
    );
}
