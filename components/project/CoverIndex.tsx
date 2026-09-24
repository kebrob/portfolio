"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { AUTHOR, type Project } from "@/lib/projects";
import { Art, ART_WEIGHT, BackLink, Byline, GUTTER, Label, VisitButton } from "./kit";

/*
 * The project page: a cover that holds the whole first screen, then an index of
 * facts rather than an essay.
 *
 * Thirty candidates were built for this in the lab and this is the one that
 * stayed, for a reason that is about the content rather than the drawing. None
 * of this work can show a screenshot, name a figure in absolute terms, or quote
 * a customer — so a page built around a narrative spends four hundred words
 * having every specific removed from it. An index cannot do that. Eight true
 * lines, one of which says what was withheld, reads as deliberate; a short essay
 * reads as thin. And the cover carries the page on its own, so nothing below it
 * has to work hard.
 *
 * The prose tail under the index is the extension the design always allowed for
 * and it is capped at three paragraphs in lib/projects.ts. That cap is the
 * design: past it, the page is an essay again and the index becomes a spec
 * sheet stapled to the front of one.
 */
export default function CoverIndex({ project }: { project: Project }) {
    const reduced = usePrefersReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    const rows: { term: string; value: React.ReactNode }[] = [
        { term: "Client", value: project.client },
        { term: "Engagement", value: project.engagement },
        { term: "Role", value: project.role },
        { term: "Year", value: project.period ?? project.year },
        { term: "Stack", value: project.stack.join(", ") },
        ...project.stats.map((stat) => ({
            term: stat.label,
            value: (
                <span>
                    <span className="text-[var(--page-fg)]">{stat.value}</span>
                    {stat.method && (
                        <span className="theme-fade mt-1 block font-mono text-[11px] leading-[1.7] text-[var(--page-faint)]">
                            {stat.method}
                        </span>
                    )}
                </span>
            ),
        })),
        ...(project.withheld ? [{ term: "Withheld", value: project.withheld.join(" · ") }] : []),
    ];

    return (
        <div className="theme-fade pb-28 text-[var(--page-fg)]">
            <div
                ref={ref}
                className="relative flex h-[92vh] min-h-[34rem] flex-col justify-between"
            >
                <motion.div
                    aria-hidden="true"
                    style={reduced ? undefined : { scale, opacity }}
                    className="pointer-events-none absolute inset-0 overflow-hidden"
                >
                    <Art
                        variant={project.hero.art}
                        seed={project.hero.seed}
                        ratio="h-full"
                        /*
                         * 0.42 rather than the 0.6 this shipped with: the art is
                         * the ground the title sits on, and at 0.6 the denser
                         * variants were reading as the subject. ART_WEIGHT then
                         * pulls the heavier ones down further — see kit.tsx.
                         */
                        style={{ opacity: 0.42 * ART_WEIGHT[project.hero.art] }}
                    />
                </motion.div>

                {/*
                 * pt-32 matches the archive index's own pt-32, so the back link
                 * and the toggle sit at the same height on both pages. It is
                 * also what clears the nav's blur band: at pt-14 the row landed
                 * inside it and the two sets of small caps overlapped.
                 */}
                <div className={`relative flex items-center justify-between gap-6 pt-32 ${GUTTER}`}>
                    <BackLink />
                    <PaperInkToggle />
                </div>

                <div className={`relative pb-12 ${GUTTER}`}>
                    <div className="theme-fade mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[10px] tracking-[0.3em] text-[var(--page-faint)] uppercase">
                        <span className="text-[var(--page-fg)]">{project.kicker}</span>
                        <span>{project.period ?? project.year}</span>
                        {project.ongoing && <span>Ongoing</span>}
                    </div>
                    <h1 className="max-w-[14ch] text-[clamp(3rem,11vw,9rem)] leading-[0.86] font-bold tracking-[-0.055em]">
                        {project.title}
                    </h1>
                </div>
            </div>

            <div className={`mx-auto w-full max-w-[52rem] pt-20 ${GUTTER}`}>
                <p className="theme-fade text-[21px] leading-[1.5] text-[var(--page-fg)] md:text-[25px]">
                    {project.deck}
                </p>

                <dl className="theme-fade mt-14 border-t border-[var(--page-rule)]">
                    {rows.map(({ term, value }) => (
                        <div
                            key={term}
                            className="theme-fade grid gap-x-8 gap-y-1.5 border-b border-[var(--page-rule-soft)] py-5 sm:grid-cols-[12rem_minmax(0,1fr)]"
                        >
                            <dt>
                                <Label>{term}</Label>
                            </dt>
                            <dd className="theme-fade text-[15px] leading-[1.6] text-[var(--page-muted)]">
                                {value}
                            </dd>
                        </div>
                    ))}
                </dl>

                {/*
                 * The tail. Set at reading size but narrower than the index
                 * above it, so it reads as a note appended to the facts rather
                 * than as the article the page decided not to be.
                 */}
                {project.body && (
                    <div className="mt-16 max-w-[40rem]">
                        <Label>Notes</Label>
                        <div className="mt-5 space-y-5">
                            {project.body.map((paragraph) => (
                                <p
                                    key={paragraph.slice(0, 40)}
                                    className="theme-fade text-[17px] leading-[1.65] text-[var(--page-muted)]"
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-16 flex flex-wrap items-center justify-between gap-6">
                    <Byline author={AUTHOR} updated={project.updated} />
                    {project.link && <VisitButton href={project.link} label="Open" />}
                </div>
            </div>
        </div>
    );
}
