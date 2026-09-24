"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useFormatter, useTranslations } from "next-intl";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { monthDate, type Project } from "@/lib/projects";
import { AUTHOR } from "@/lib/site";
import { Art, ART_WEIGHT, BackLink, Byline, GUTTER, Label, VisitButton } from "./kit";

/*
 * The project page: a cover that holds the whole first screen, then an index of
 * facts rather than an essay.
 *
 * None of this work can show a screenshot, name a figure in absolute terms, or
 * quote a customer (NDA), so a narrative would spend its words having every
 * specific removed. Eight true lines, one of which says what was withheld,
 * reads as deliberate; a short essay reads as thin.
 *
 * The prose tail under the index is capped at three paragraphs in
 * lib/projects.ts. Past that, the page is an essay again.
 */
export default function CoverIndex({ project }: { project: Project }) {
    const reduced = usePrefersReducedMotion();
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const t = useTranslations("project");
    const format = useFormatter();

    const period =
        project.to === null
            ? t("periodOngoing", { from: project.from })
            : t("period", { from: project.from, to: project.to });
    const updated = format.dateTime(monthDate(project.updated), {
        month: "long",
        year: "numeric",
    });

    const rows: { term: string; value: React.ReactNode }[] = [
        { term: t("terms.client"), value: project.client },
        { term: t("terms.engagement"), value: project.engagement },
        { term: t("terms.role"), value: project.role },
        { term: t("terms.year"), value: period },
        { term: t("terms.stack"), value: format.list(project.stack, { type: "unit" }) },
        ...project.stats.map((stat) => ({
            term: stat.label,
            value: (
                <span>
                    <span className="text-[var(--page-fg)]">{stat.value}</span>
                    {stat.method && (
                        <span className="theme-fade mt-1 block font-mono text-mini leading-[1.7] text-[var(--page-faint)]">
                            {stat.method}
                        </span>
                    )}
                </span>
            ),
        })),
        ...(project.withheld
            ? [{ term: t("terms.withheld"), value: project.withheld.join(" · ") }]
            : []),
    ];

    return (
        <div className="theme-fade pb-28 text-[var(--page-fg)]">
            {/* overflow-x-clip: the art scales to 1.08 on the way out, and
                unclipped it widens the page into a sideways scroll. */}
            <div
                ref={ref}
                className="relative flex h-[92vh] min-h-[34rem] flex-col justify-between overflow-x-clip"
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
                         * The art is the ground the title sits on, not the
                         * subject. ART_WEIGHT pulls the denser variants down
                         * further — see kit.tsx.
                         */
                        style={{ opacity: 0.42 * ART_WEIGHT[project.hero.art] }}
                    />
                </motion.div>

                {/*
                 * pt-32 matches the archive index's own pt-32, so the back link
                 * and the toggle sit at the same height on both pages, clear of
                 * the nav's blur band.
                 */}
                <div className={`relative flex items-center justify-between gap-6 pt-32 ${GUTTER}`}>
                    <BackLink />
                    <PaperInkToggle />
                </div>

                <div className={`relative pb-12 ${GUTTER}`}>
                    <div className="theme-fade mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-mini tracking-label text-[var(--page-faint)] uppercase">
                        <span className="text-[var(--page-fg)]">{project.kicker}</span>
                        <span>{period}</span>
                        {project.to === null && <span>{t("ongoing")}</span>}
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
                        <Label>{t("notes")}</Label>
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
                    <Byline author={AUTHOR} updated={updated} />
                    {project.link && <VisitButton href={project.link} label={t("open")} />}
                </div>
            </div>
        </div>
    );
}
