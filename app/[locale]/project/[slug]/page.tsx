import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import CoverIndex from "@/components/project/CoverIndex";
import ProjectPager from "@/components/project/ProjectPager";
import ThemedPage from "@/components/ThemedPage";
import type { Locale } from "@/i18n/routing";
import { PROJECT_SLUGS, resolveProjects } from "@/lib/projects";
import { alternatesFor } from "@/lib/seo";

interface PageProps {
    params: Promise<{ locale: Locale; slug: string }>;
}

export function generateStaticParams() {
    return PROJECT_SLUGS.map((slug) => ({ slug }));
}

async function getProject(locale: Locale, slug: string) {
    const projects = resolveProjects((await getMessages({ locale })).projectContent);
    const index = projects.findIndex((p) => p.slug === slug);
    if (index === -1) return null;

    const at = (i: number) => projects[(i + projects.length) % projects.length];
    return { project: projects[index], prev: at(index - 1), next: at(index + 1) };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const project = (await getProject(locale, slug))?.project;
    if (!project) return {};
    return {
        title: project.title,
        description: project.description,
        // The one place the tags are read. They describe the work rather than
        // label it on screen, which is why the page itself does not print them.
        keywords: project.tags,
        alternates: alternatesFor(locale, `/project/${slug}`),
        openGraph: { type: "article", title: project.title, description: project.description },
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const { locale, slug } = await params;
    const found = await getProject(locale, slug);

    if (!found) notFound();
    const { project, prev, next } = found;

    // CoverIndex is a client component because the cover's art tracks scroll,
    // so this file is only routing, metadata and the themed shell around it.
    return (
        <ThemedPage>
            <CoverIndex project={project} />
            <ProjectPager
                prev={{ slug: prev.slug, title: prev.title }}
                next={{ slug: next.slug, title: next.title }}
            />
        </ThemedPage>
    );
}
