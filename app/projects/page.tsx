import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { projects } from "@/lib/projects";

export const metadata = {
    title: "Projects",
    description: "A collection of selected work and side projects.",
};

export default function ProjectsPage() {
    return (
        <main className="dark-section min-h-screen px-5 md:px-10 lg:px-20 py-32 text-[hsl(45_30%_96%)]">
            {/* Back home */}
            <Link
                href="/"
                className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.3em] text-[hsl(0_0%_55%)] hover:text-[hsl(45_30%_96%)] transition-colors mb-20 hoverable"
            >
                <span className="text-base leading-none">←</span>
                <span>Back home</span>
            </Link>

            <div className="mb-16">
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-[hsl(0_0%_55%)] block mb-6">
                    Selected Work
                </span>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                    All Projects
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, index) => (
                    <Link
                        key={project.slug}
                        href={`/project/${project.slug}`}
                        className="group hoverable"
                    >
                        <article className="relative border border-[hsl(0_0%_20%)] bg-[hsl(0_0%_10%)] p-8 h-[280px] flex flex-col justify-between transition-all duration-500 group-hover:bg-[hsl(0_0%_13%)] group-hover:border-[hsl(0_0%_30%)]">
                            {/* Corner accent */}
                            <div className="absolute top-0 left-0 w-10 h-px bg-[hsl(45_30%_96%/0.3)]" />
                            <div className="absolute top-0 left-0 w-px h-10 bg-[hsl(45_30%_96%/0.3)]" />

                            <div>
                                <span className="font-mono text-[10px] uppercase tracking-widest text-[hsl(0_0%_40%)] mb-4 block">
                                    {String(index + 1).padStart(2, "0")} — {project.year}
                                </span>
                                <h2 className="text-2xl font-bold mb-3 transition-transform duration-300 group-hover:translate-x-1">
                                    {project.title}
                                </h2>
                                <p className="text-[hsl(0_0%_55%)] text-sm leading-relaxed">
                                    {project.description}
                                </p>
                            </div>

                            <div className="flex items-end justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="font-mono text-[10px] uppercase tracking-wider text-[hsl(0_0%_45%)] border border-[hsl(0_0%_20%)] px-2 py-1"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <ArrowUpRight className="w-5 h-5 text-[hsl(0_0%_55%)] opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </main>
    );
}
