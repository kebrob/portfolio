import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ThemedPage from "@/components/ThemedPage";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
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
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const { slug } = await params;
    const project = getProjectBySlug(slug);

    if (!project) notFound();

    return (
        <ThemedPage>
            {/* theme-fade here so the title and body inherit the fade — see /projects */}
            <div className="theme-fade px-5 pt-32 pb-32 text-[var(--page-fg)] md:px-10 lg:px-20">
                {/*
                 * Back goes up one level, to the archive, because that is the
                 * level this page sits under — not to wherever you happened to
                 * come from. Home is one click away regardless: the wordmark in
                 * the nav is a link to it on every page, which is why there is
                 * no second "back home" competing with this one.
                 */}
                <div className="mb-20 flex items-center justify-between gap-6">
                    <Link
                        href="/projects"
                        className="theme-fade hoverable inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[var(--page-muted)] uppercase hover:text-[var(--page-fg)]"
                    >
                        <span className="text-base leading-none">←</span>
                        <span>All projects</span>
                    </Link>

                    <PaperInkToggle />
                </div>

                <div className="max-w-3xl">
                    {/* Meta */}
                    <div className="theme-fade mb-8 flex flex-wrap items-center gap-6 font-mono text-xs tracking-[0.3em] text-[var(--page-muted)] uppercase">
                        <span>{project.year}</span>
                        <span>{project.role}</span>
                    </div>

                    {/* Title */}
                    <h1 className="mb-8 text-5xl leading-tight font-bold tracking-tight md:text-7xl">
                        {project.title}
                    </h1>

                    {/* Tags */}
                    <div className="mb-16 flex flex-wrap gap-3">
                        {project.tags.map((tag) => (
                            <span
                                key={tag}
                                className="theme-fade border border-[var(--page-rule)] px-3 py-1.5 font-mono text-xs tracking-wider text-[var(--page-muted)] uppercase"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Divider */}
                    <div className="theme-fade mb-16 h-px w-full bg-[var(--page-rule)]" />

                    {/* Long description */}
                    <p className="theme-fade mb-20 text-lg leading-relaxed text-[var(--page-muted)] md:text-xl">
                        {project.longDescription}
                    </p>

                    {/* Tech stack */}
                    <div className="mb-16">
                        <span className="theme-fade mb-6 block font-mono text-xs tracking-[0.3em] text-[var(--page-muted)] uppercase">
                            Tech Stack
                        </span>
                        <div className="flex flex-wrap gap-3">
                            {project.tech.map((t) => (
                                <span
                                    key={t}
                                    className="theme-fade border border-[var(--page-rule)] px-4 py-2 font-mono text-sm"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* External link */}
                    {project.link && (
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hoverable group inline-flex items-center gap-3 border border-[var(--page-rule)] px-8 py-4 transition-colors duration-300 hover:bg-[var(--page-inv)] hover:text-[var(--page-inv-fg)]"
                        >
                            <span className="font-mono text-sm tracking-wider uppercase">
                                View Project
                            </span>
                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
                        </a>
                    )}
                </div>
            </div>
        </ThemedPage>
    );
}
