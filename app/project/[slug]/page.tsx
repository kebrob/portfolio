import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CoverIndex from "@/components/project/CoverIndex";
import ThemedPage from "@/components/ThemedPage";
import { projects, getProjectBySlug } from "@/lib/projects";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const project = getProjectBySlug(slug);
    if (!project) return { title: "Project Not Found" };
    return {
        title: project.title,
        description: project.description,
        // The one place the tags are read. They describe the work rather than
        // label it on screen, which is why the page itself does not print them.
        keywords: project.tags,
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) notFound();

    /*
     * The whole page is the layout that won in the lab — cover, then index. It
     * is a client component because the cover's art tracks scroll, so this file
     * is only routing, metadata and the themed shell around it.
     */
    return (
        <ThemedPage>
            <CoverIndex project={project} />
        </ThemedPage>
    );
}
