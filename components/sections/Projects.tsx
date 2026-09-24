"use client";

import { useMessages, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { headlineStat, resolveProjects } from "@/lib/projects";
import { OVER_INK } from "@/lib/ink/dark-panel";

/*
 * Featured work, as three figures.
 *
 * This work is under NDA: there is no screenshot to show, so the one number that
 * cleared takes the space a screenshot would have had, and the project title
 * sits under it at reading size.
 *
 * Deliberately not a stats bar: these are three separate projects rather than
 * three facts about one thing, each figure is a link, and the title under it
 * carries equal weight.
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
 *
 * The bottom padding is free, and below lg it is kept short so the wall runs
 * straight into the contact section, which is only as tall as its content
 * there.
 */

const FEATURED_COUNT = 3;

export default function Projects() {
    const t = useTranslations("featured");
    const tProject = useTranslations("project");
    const projects = resolveProjects(useMessages().projectContent);
    const featured = projects.slice(0, FEATURED_COUNT);
    const remaining = projects.length - FEATURED_COUNT;

    return (
        <section
            id="projects"
            className="dark-section px-[6.7vw] pt-20 pb-16 md:pt-[110px] md:pb-24 lg:pb-[28vh]"
            /*
             * Keeps .dark-section for its text colour and because the Header's
             * intersection check watches that class, but drops the background it
             * normally paints: the dark here comes from the fixed ink backdrop
             * behind the page. An opaque background of its own would hide the ink
             * entirely and the section would arrive already black.
             */
            style={OVER_INK}
        >
            {/* 1248px = the design's 1440px canvas minus its 96px side padding */}
            <div className="mx-auto max-w-[1248px]">
                {/*
                 * Same treatment as About's section label, but an <h2>: the
                 * titles below are <h3>s, and without a heading here they
                 * would file themselves under Experience in the outline.
                 */}
                <h2 className="mb-16 block font-mono text-xs tracking-label uppercase">
                    {t("eyebrow")}
                </h2>

                <div className="grid border-t border-grey-20 md:grid-cols-3">
                    {featured.map((project) => {
                        const stat = headlineStat(project);

                        return (
                            <Link
                                key={project.slug}
                                href={`/project/${project.slug}`}
                                /*
                                 * Divided by rules rather than spaced apart:
                                 * three columns with gaps read as three cards.
                                 *
                                 * first:pl-0 / last:pr-0 keep the outer figures
                                 * flush with the eyebrow and the page gutter, so
                                 * the padding only ever falls between cells.
                                 */
                                className="hoverable group flex min-w-0 flex-col justify-between gap-12 border-b border-grey-20 py-10 md:border-r md:border-b-0 md:px-8 md:py-12 md:first:pl-0 md:last:border-r-0 md:last:pr-0"
                            >
                                <div>
                                    <div className="text-[clamp(3.25rem,6.5vw,5.5rem)] leading-[0.82] font-bold tracking-[-0.055em] text-grey-65 tabular-nums transition-colors duration-500 group-hover:text-paper">
                                        {stat.value}
                                    </div>
                                    {/*
                                     * The label finishes the figure's sentence,
                                     * so it is set as one: body face, reading
                                     * size — not a caps caption.
                                     */}
                                    <p className="mt-4 max-w-[26ch] text-[15px] leading-[1.45] text-grey-65 transition-colors duration-500 group-hover:text-grey-80">
                                        {stat.label}
                                    </p>
                                </div>

                                <div>
                                    <h3 className="text-[20px] leading-[1.2] font-medium tracking-[-0.02em] transition-transform duration-500 ease-out-expo group-hover:translate-x-1">
                                        {project.title}
                                    </h3>
                                    <p className="mt-3 font-mono text-mini leading-[1.7] tracking-meta text-grey-50 uppercase">
                                        {tProject("meta", {
                                            year: project.year,
                                            role: project.role,
                                        })}
                                    </p>
                                </div>
                            </Link>
                        );
                    })}
                </div>

                <Link
                    href="/projects"
                    className="hoverable group mt-12 inline-flex items-baseline gap-3 font-mono text-xs tracking-caps text-grey-55 uppercase transition-colors duration-300 hover:text-paper"
                >
                    <span>{t("all")}</span>
                    <span className="text-grey-50 transition-colors duration-300 group-hover:text-paper">
                        {t("remaining", { count: remaining })}
                    </span>
                    <span className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                        ↗
                    </span>
                </Link>
            </div>
        </section>
    );
}
