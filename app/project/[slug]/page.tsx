import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects, getProjectBySlug } from "@/lib/projects";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps) {
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
        <main className="dark-section min-h-screen px-5 md:px-10 lg:px-20 py-32 text-[hsl(45_30%_96%)]">
            {/* Back */}
            <Link
                href="/projects"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[hsl(0_0%_55%)] hover:text-[hsl(45_30%_96%)] transition-colors mb-20 hoverable"
            >
                <span className="text-base leading-none">←</span>
                <span>All projects</span>
            </Link>

            <div className="max-w-3xl">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(0_0%_55%)]">
                        {project.year}
                    </span>
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(0_0%_55%)]">
                        {project.role}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                    {project.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-16">
                    {project.tags.map((tag) => (
                        <span
                            key={tag}
                            className="font-mono text-xs uppercase tracking-wider text-[hsl(0_0%_55%)] border border-[hsl(0_0%_25%)] px-3 py-1.5"
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-[hsl(0_0%_20%)] mb-16" />

                {/* Long description */}
                <p className="text-lg md:text-xl text-[hsl(0_0%_65%)] leading-relaxed mb-20">
                    {project.longDescription}
                </p>

                {/* Tech stack */}
                <div className="mb-16">
                    <span className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(0_0%_55%)] block mb-6">
                        Tech Stack
                    </span>
                    <div className="flex flex-wrap gap-3">
                        {project.tech.map((t) => (
                            <span
                                key={t}
                                className="font-mono text-sm text-[hsl(45_30%_96%)] border border-[hsl(0_0%_25%)] px-4 py-2 hover:border-[hsl(0_0%_45%)] transition-colors"
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
                        className="group hoverable inline-flex items-center gap-3 border border-[hsl(0_0%_25%)] px-8 py-4 transition-all duration-300 hover:border-[hsl(0_0%_50%)] hover:bg-[hsl(0_0%_10%)]"
                    >
                        <span className="font-mono text-sm uppercase tracking-wider">
                            View Project
                        </span>
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </a>
                )}
            </div>
        </main>
    );
}
