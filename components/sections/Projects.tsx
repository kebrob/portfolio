import Link from "next/link";
import { headlineStat, projects } from "@/lib/projects";

/*
 * Featured work, as three figures.
 *
 * This work is under NDA: there is no client name, no product name and no
 * screenshot to show. What is left is the one number that cleared — so the
 * number takes the space a screenshot would have had, at the size a screenshot
 * would have been, and the project title sits under it at reading size.
 *
 * It is deliberately not a stats bar, and the difference is worth keeping if
 * this is ever edited: these are three separate projects rather than three facts
 * about one thing, each figure is a link, and the title under it carries equal
 * weight. A row of KPIs would shrink the labels and put nothing underneath.
 *
 * It replaced a wall of post-it notes, which were the only colour on the site,
 * the only skeuomorphic object, and the only element with a drop shadow — three
 * departures from a page built entirely from type and hairlines. Nothing here
 * paints anything.
 *
 * NOTHING MOVES on arrival, and that is load-bearing rather than an omission.
 * This section comes up out of the ink flood (see ProjectsTransition), which is
 * the largest gesture on the page; a reveal here would be competing with it. The
 * only movement is on hover.
 *
 * The vertical rhythm is not free either. ProjectsTransition times the handover
 * against the first VISIBLE row — the eyebrow, ~110px into the section — so
 * pt-20 / md:pt-[110px] and the eyebrow's mb-16 are fixed by that calculation.
 * Changing them moves where the flood finishes relative to the label.
 */

const FEATURED_COUNT = 3;

export default function Projects() {
    const featured = projects.slice(0, FEATURED_COUNT);
    const remaining = projects.length - FEATURED_COUNT;

    return (
        <section
            id="projects"
            className="dark-section px-[6.7vw] pt-20 pb-40 md:pt-[110px] md:pb-[28vh]"
            /*
             * Keeps .dark-section for its text colour and because the Header's
             * intersection check watches that class, but drops the background it
             * normally paints: the dark here comes from the fixed ink backdrop
             * behind the page. An opaque background of its own would hide the ink
             * entirely and the section would arrive already black.
             */
            style={{ backgroundColor: "transparent", backgroundImage: "none" }}
        >
            {/* 1248px = the design's 1440px canvas minus its 96px side padding */}
            <div className="mx-auto max-w-[1248px]">
                {/* Same treatment as About's section label */}
                <span className="mb-16 block font-mono text-xs tracking-[0.3em] uppercase">
                    Featured Work
                </span>

                <div className="grid border-t border-grey-20 md:grid-cols-3">
                    {featured.map((project) => {
                        const stat = headlineStat(project);

                        return (
                            <Link
                                key={project.slug}
                                href={`/project/${project.slug}`}
                                /*
                                 * The cells are divided by rules rather than
                                 * spaced apart: three columns with gaps read as
                                 * three cards, and the moment they read as cards
                                 * the section is the post-it wall again in a
                                 * different costume.
                                 *
                                 * first:pl-0 / last:pr-0 keep the outer figures
                                 * flush with the eyebrow and the page gutter, so
                                 * the padding only ever falls between cells.
                                 */
                                className="hoverable group flex flex-col justify-between gap-12 border-b border-grey-20 py-10 md:border-r md:border-b-0 md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                            >
                                <div>
                                    <div className="text-[clamp(3.25rem,6.5vw,5.5rem)] leading-[0.82] font-bold tracking-[-0.055em] text-grey-65 tabular-nums transition-colors duration-500 group-hover:text-paper">
                                        {stat.value}
                                    </div>
                                    <div className="mt-5 font-mono text-[11px] leading-[1.7] tracking-[0.15em] text-grey-45 uppercase">
                                        {stat.label}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-[20px] leading-[1.2] font-medium tracking-[-0.02em] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1">
                                        {project.title}
                                    </h3>
                                    <p className="mt-3 font-mono text-[10px] leading-[1.7] tracking-[0.15em] text-grey-45 uppercase">
                                        {project.year} · {project.role}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                {/*
                 * The archive link, not a button. The wall's one good structural
                 * idea was that the way to the full index is part of the section
                 * rather than a call to action bolted under it.
                 */}
                <Link
                    href="/projects"
                    className="hoverable group mt-12 inline-flex items-baseline gap-3 font-mono text-xs tracking-[0.25em] text-grey-55 uppercase transition-colors duration-300 hover:text-paper"
                >
                    <span>Every project</span>
                    <span className="text-grey-40 transition-colors duration-300 group-hover:text-paper">
                        +{remaining}
                    </span>
                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        ↗
                    </span>
                </Link>
            </div>
        </section>
    );
}
