import type { Metadata } from "next";
import Link from "next/link";
import ThemedPage from "@/components/ThemedPage";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
import { projects } from "@/lib/projects";

/*
 * The archive, as an index rather than a gallery.
 *
 * One full-bleed row per project — number, title, role, stack, year — with no
 * cards and nothing decorative that is not a rule or a column header. The
 * featured wall on the home page is the tactile half of the story (paper,
 * angles, shadows); this is the filing system behind it, and it stays a list at
 * forty entries in a way none of the other shapes tried here would.
 *
 * The one gesture is the hover: a row inverts to the opposite ground, the same
 * move the nav's contact button makes. It does the work a thumbnail usually
 * does — telling you where you are — which matters because there is no imagery
 * to do it with.
 *
 * Colours come from the --page-* tokens, so both this page and the detail page
 * follow the paper/ink switch. See globals.css and lib/page-theme.tsx.
 */

export const metadata: Metadata = {
    title: "Projects",
    description: "A collection of selected work and side projects.",
};

/*
 * The column track, shared by the sticky header and every row so the two cannot
 * drift. Below md it collapses to number + title, and the remaining fields fold
 * into one meta line under the title.
 */
const COLUMNS = "grid-cols-[3.5rem_1fr] md:grid-cols-[5rem_minmax(0,1.6fr)_1fr_1fr_5rem]";

export default function ProjectsPage() {
    // Newest first. lib/projects.ts is in curated order — that is the right
    // order for the home page's featured three, and the wrong one for an
    // archive, where the year column is the thing being scanned.
    const entries = [...projects].sort((a, b) => Number(b.year) - Number(a.year));

    return (
        <ThemedPage>
            {/*
             * theme-fade on the container, not only on the pieces that set their
             * own colour: everything below inherits --page-fg from here, and an
             * inherited colour follows whatever its ancestor is animating.
             * Without it the headline and the row titles snapped at the midpoint
             * of the flood while the muted text faded, which is the same tear
             * the column header used to show from the other side.
             */}
            <div className="theme-fade pt-32 pb-40 text-[var(--page-fg)]">
                <header className="px-5 md:px-10 lg:px-20">
                    <div className="mb-24 flex items-center justify-between gap-6">
                        <Link
                            href="/"
                            className="theme-fade hoverable inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[var(--page-muted)] uppercase hover:text-[var(--page-fg)]"
                        >
                            <span className="text-base leading-none">←</span>
                            <span>Back home</span>
                        </Link>

                        <PaperInkToggle />
                    </div>

                    <h1 className="text-[clamp(3rem,11vw,9rem)] leading-[0.85] font-bold tracking-[-0.04em]">
                        Archive
                    </h1>
                </header>

                {/*
                 * Column headers stick under the nav band — top-11 clears it
                 * rather than sliding under its text. A long index without them
                 * loses the reader by the third screen: the row grammar has to
                 * stay on screen for the columns to keep meaning anything.
                 */}
                <div className="page-veil theme-fade sticky top-11 z-20 mt-20 border-y border-[var(--page-rule)]">
                    <div
                        className={`grid ${COLUMNS} theme-fade gap-4 px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-[var(--page-faint)] uppercase md:px-10 lg:px-20`}
                    >
                        <span>No.</span>
                        <span>Project</span>
                        <span className="hidden md:block">Role</span>
                        <span className="hidden md:block">Stack</span>
                        <span className="hidden text-right md:block">Year</span>
                    </div>
                </div>

                <ul>
                    {entries.map((project, index) => (
                        <li
                            key={project.slug}
                            className="theme-fade border-b border-[var(--page-rule-soft)]"
                        >
                            <Link
                                href={`/project/${project.slug}`}
                                className={`hoverable group grid ${COLUMNS} items-baseline gap-4 px-5 py-7 transition-colors duration-300 hover:bg-[var(--page-inv)] hover:text-[var(--page-inv-fg)] md:px-10 md:py-8 lg:px-20`}
                            >
                                <span className="font-mono text-[11px] text-[var(--page-faint)] tabular-nums transition-colors duration-300 group-hover:text-[var(--page-inv-faint)]">
                                    {String(index + 1).padStart(2, "0")}
                                </span>

                                <span className="flex items-baseline gap-4">
                                    <span className="text-2xl leading-[1.05] font-bold tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-1 md:text-4xl">
                                        {project.title}
                                    </span>
                                    {/* Arrow rides in from the title, not from the row edge */}
                                    <span className="translate-x-[-6px] font-mono text-lg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                                        ↗
                                    </span>
                                </span>

                                <span className="hidden font-mono text-[11px] tracking-[0.15em] text-[var(--page-muted)] uppercase transition-colors duration-300 group-hover:text-[var(--page-inv-muted)] md:block">
                                    {project.role}
                                </span>

                                <span className="hidden font-mono text-[11px] tracking-[0.15em] text-[var(--page-muted)] uppercase transition-colors duration-300 group-hover:text-[var(--page-inv-muted)] md:block">
                                    {project.stack.slice(0, 3).join(" · ")}
                                </span>

                                <span className="hidden text-right font-mono text-[11px] text-[var(--page-faint)] tabular-nums transition-colors duration-300 group-hover:text-[var(--page-inv-faint)] md:block">
                                    {project.year}
                                </span>

                                {/* Below md the columns collapse into a single meta line */}
                                <span className="col-start-2 -mt-3 font-mono text-[10px] tracking-[0.15em] text-[var(--page-faint)] uppercase transition-colors duration-300 group-hover:text-[var(--page-inv-faint)] md:hidden">
                                    {project.year} · {project.role}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </ThemedPage>
    );
}
