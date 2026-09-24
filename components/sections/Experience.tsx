"use client";

import { useRef } from "react";
import { motion, useTransform, MotionValue } from "framer-motion";
import { useSectionProgress } from "@/lib/use-section-progress";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

interface Role {
    year: string;
    period: string;
    role: string;
    company: string;
    description: string[];
    technologies: string[];
}

const experiences: Role[] = [
    {
        year: "2024",
        period: "Jun 2024 — Present",
        role: "Frontend Lead",
        company: "Calida Group Digital GmbH",
        description: [
            "Leading frontend architecture and UI consistency across projects while mentoring developers and guiding implementation quality.",
            "Currently building customer systems including CRM tools, email workflows, and SAP CRM integrations.",
        ],
        technologies: ["Nest.js", "Typescript", "RabbitMQ", "PHP", "Shopware", "SAP", "AI"],
    },
    {
        year: "2021",
        period: "Dec 2021 — Jun 2024",
        role: "Web Developer",
        company: "Calida Group Digital GmbH",
        description: [
            "Worked on product systems, building backend services to integrate product data into the shop and supporting product page development during platform changes.",
            "Helped evolve the ecommerce architecture across frontend and backend.",
        ],
        technologies: ["Node.js", "Typescript", "RabbitMQ", "MongoDB", "SQL", "PHP", "Shopware"],
    },
    {
        year: "2019",
        period: "Aug 2019 — Dec 2021",
        role: "Intern & Working Student",
        company: "Calida Group Digital GmbH",
        description: [
            "Built CMS-driven pages and frontend widgets for an ecommerce platform. Worked on reusable UI components connected to a content service and storefront features.",
            "Learned production workflows and delivering frontend features in a team environment.",
        ],
        technologies: ["Node.js", "Typescript", "CMS", "SCSS", "PHP", "Oxid"],
    },
];

// Phase boundaries within the section's 0→1 scroll progress: INTRO_END is
// where the title has finished fading out, EXIT_START where the last card
// stops holding.
const INTRO_END = 0.15;
const EXIT_START = 0.92;
const EXPERIENCE_STEP = (EXIT_START - INTRO_END) / experiences.length;

// One dot row is 52px: py-4 either side (32px) plus the ~20px dot and label.
const TIMELINE_HEIGHT = experiences.length * 52;

// Shared by the desktop and mobile timeline dots — same state, different layout.
// Opacity: future = 0.3, current = 1, past = 0.6.
// Scale: stays big for the entire experience duration.
function useDotTransforms(scrollYProgress: MotionValue<number>, index: number) {
    const expStart = INTRO_END + index * EXPERIENCE_STEP;
    const expEnd = INTRO_END + (index + 1) * EXPERIENCE_STEP;
    const range = [expStart - 0.01, expStart, expEnd, expEnd + 0.01];

    return {
        opacity: useTransform(scrollYProgress, range, [0.3, 1, 0.6, 0.6]),
        scale: useTransform(scrollYProgress, range, [1, 1.25, 1.25, 1]),
    };
}

export default function Experience() {
    const containerRef = useRef<HTMLDivElement>(null);
    // The hydration-safe hook, not framer's: framer's reads the media query in
    // the first client render, so a reduced-motion visitor gets a different
    // `style` than the server emitted. See lib/use-prefers-reduced-motion.ts.
    const prefersReducedMotion = usePrefersReducedMotion();

    const scrollYProgress = useSectionProgress(containerRef);

    const introOpacity = useTransform(scrollYProgress, [0, INTRO_END * 0.7, INTRO_END], [1, 1, 0]);

    // Fades in as the title fades out.
    const contentOpacity = useTransform(
        scrollYProgress,
        [INTRO_END * 0.9, INTRO_END * 1.1],
        [0, 1]
    );

    const timelineProgress = useTransform(scrollYProgress, [INTRO_END, EXIT_START], [0, 1]);

    return (
        <section
            ref={containerRef}
            className="relative"
            style={{ height: `${(experiences.length + 2) * 100}vh` }}
            aria-label="Work Experience"
        >
            {/* Sticky container. pt-20 below `tall` reserves .nav-blur's 80px so the
                vertically centred card cannot ride up under the header on short
                viewports; it does not move the intro headline below, which is
                `absolute inset-0` and so resolves against the padding box. */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden pt-20 tall:pt-0">
                <div className="w-full max-w-6xl mx-auto px-[20px] md:px-[40px] lg:px-[80px]">
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ opacity: prefersReducedMotion ? 1 : introOpacity }}
                    >
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                            Experience
                        </h2>
                    </motion.div>

                    <motion.div
                        // The height-gated gap is scoped to `max-md:` on purpose. Below md
                        // this is a column, so the gap costs vertical space and has to
                        // shrink on short viewports; from md up it is a row gap that costs
                        // no height. It also MUST be scoped: `tall:` is a custom variant, so
                        // Tailwind sorts it after the built-in breakpoints, and a bare
                        // `tall:gap-8` would override `md:gap-16`/`lg:gap-24` on any tall
                        // desktop viewport.
                        className="flex flex-col md:flex-row gap-4 max-md:tall:gap-8 md:gap-16 lg:gap-24 items-start"
                        style={{
                            opacity: prefersReducedMotion ? 1 : contentOpacity,
                        }}
                    >
                        <DesktopTimeline
                            scrollYProgress={scrollYProgress}
                            timelineProgress={timelineProgress}
                            prefersReducedMotion={prefersReducedMotion}
                        />

                        <MobileTimeline
                            scrollYProgress={scrollYProgress}
                            timelineProgress={timelineProgress}
                            prefersReducedMotion={prefersReducedMotion}
                        />

                        <ExperienceContent
                            scrollYProgress={scrollYProgress}
                            prefersReducedMotion={prefersReducedMotion}
                        />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

function DesktopTimeline({
    scrollYProgress,
    timelineProgress,
    prefersReducedMotion,
}: {
    scrollYProgress: MotionValue<number>;
    timelineProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    return (
        <div
            className="hidden md:flex flex-col relative py-4 min-w-[100px]"
            role="navigation"
            aria-label="Timeline"
        >
            <div
                className="absolute left-[5px] w-px bg-grey-85"
                style={{ height: `${TIMELINE_HEIGHT}px` }}
            />

            {/* Fills gradually with scroll */}
            <motion.div
                className="absolute left-[5px] w-px bg-ink"
                style={
                    prefersReducedMotion
                        ? { height: `${TIMELINE_HEIGHT}px` }
                        : {
                              height: `${TIMELINE_HEIGHT}px`,
                              scaleY: timelineProgress,
                              transformOrigin: "top",
                          }
                }
            />

            {experiences.map((exp, index) => (
                <TimelineDot
                    key={index}
                    exp={exp}
                    index={index}
                    scrollYProgress={scrollYProgress}
                    prefersReducedMotion={prefersReducedMotion}
                />
            ))}
        </div>
    );
}

function TimelineDot({
    exp,
    index,
    scrollYProgress,
    prefersReducedMotion,
}: {
    exp: Role;
    index: number;
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    const { opacity: dotOpacity, scale: dotScale } = useDotTransforms(scrollYProgress, index);

    return (
        <motion.div
            className="flex items-center gap-4 py-4"
            style={{ opacity: prefersReducedMotion ? 1 : dotOpacity }}
        >
            <motion.div
                className="w-[11px] h-[11px] rounded-full border-2 border-ink bg-ink z-10"
                style={prefersReducedMotion ? {} : { scale: dotScale }}
            />
            <span className="font-mono text-sm tracking-wider text-ink">{exp.year}</span>
        </motion.div>
    );
}

function MobileTimeline({
    scrollYProgress,
    timelineProgress,
    prefersReducedMotion,
}: {
    scrollYProgress: MotionValue<number>;
    timelineProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    return (
        <div
            className="flex md:hidden relative w-full mb-4 tall:mb-8 px-4"
            role="navigation"
            aria-label="Timeline"
        >
            <div className="flex justify-between items-start w-full relative">
                {/* Track, positioned at dot centre */}
                <div className="absolute left-0 right-0 top-[5.5px] h-px bg-grey-85" />

                <motion.div
                    className="absolute left-0 top-[5.5px] h-px bg-ink"
                    style={
                        prefersReducedMotion
                            ? { width: "100%" }
                            : {
                                  scaleX: timelineProgress,
                                  transformOrigin: "left",
                                  width: "100%",
                              }
                    }
                />

                {experiences.map((exp, index) => (
                    <MobileTimelineDot
                        key={index}
                        exp={exp}
                        index={index}
                        scrollYProgress={scrollYProgress}
                        prefersReducedMotion={prefersReducedMotion}
                    />
                ))}
            </div>
        </div>
    );
}

function MobileTimelineDot({
    exp,
    index,
    scrollYProgress,
    prefersReducedMotion,
}: {
    exp: Role;
    index: number;
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    const { opacity: dotOpacity, scale: dotScale } = useDotTransforms(scrollYProgress, index);

    return (
        <motion.div
            className="flex flex-col items-center gap-2 relative z-10"
            style={{ opacity: prefersReducedMotion ? 1 : dotOpacity }}
        >
            <motion.div
                className="w-[11px] h-[11px] rounded-full bg-ink border-2 border-ink"
                style={prefersReducedMotion ? {} : { scale: dotScale }}
            />
            <span className="font-mono text-xs text-center tracking-wider">{exp.year}</span>
        </motion.div>
    );
}

function ExperienceContent({
    scrollYProgress,
    prefersReducedMotion,
}: {
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    return (
        // A 1x1 grid: every card is placed in the same cell (col-start-1 row-start-1),
        // so they stack like absolute positioning did, but the implicit track sizes
        // itself to the TALLEST card. That matters because the sticky panel centres
        // this box with `items-center` — the previous `min-h-[350px]` was a hand-guessed
        // stand-in for the cards' height (they were absolute, so they contributed none),
        // and it guessed low: real cards run 351-380px. The panel was centring 350px
        // while the content spilled past it, so the block always sat visually low and
        // short viewports clipped it. Sizing to content removes the guess for good.
        <div className="flex-1 grid w-full">
            {experiences.map((exp, index) => (
                <ExperienceCard
                    key={index}
                    exp={exp}
                    index={index}
                    scrollYProgress={scrollYProgress}
                    prefersReducedMotion={prefersReducedMotion}
                />
            ))}
        </div>
    );
}

function ExperienceCard({
    exp,
    index,
    scrollYProgress,
    prefersReducedMotion,
}: {
    exp: Role;
    index: number;
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean;
}) {
    const expStart = INTRO_END + index * EXPERIENCE_STEP;
    const expEnd = expStart + EXPERIENCE_STEP;

    // In over the first 15% of the card's slot, out over the last 15% — except
    // the final card, which holds so the section does not end on nothing.
    const cardOpacity = useTransform(
        scrollYProgress,
        [expStart, expStart + EXPERIENCE_STEP * 0.15, expEnd - EXPERIENCE_STEP * 0.15, expEnd],
        [0, 1, 1, index < experiences.length - 1 ? 0 : 1]
    );

    const cardY = useTransform(
        scrollYProgress,
        [expStart, expStart + EXPERIENCE_STEP * 0.15],
        [20, 0]
    );

    return (
        <motion.article
            className="col-start-1 row-start-1 w-full"
            // Key sets differ on purpose: no `y` when reduced, so framer-motion
            // writes no transform at all rather than translateY(0px).
            style={
                prefersReducedMotion
                    ? { opacity: 1 }
                    : {
                          opacity: cardOpacity,
                          y: cardY,
                      }
            }
            aria-label={`${exp.role} at ${exp.company}`}
        >
            {/* The `md:tall:` / `lg:tall:` steps read as "only go up a type size when
                there is both width AND height to spare" — the card has to fit inside a
                100vh pinned panel that clips, so a short-but-wide window (a landscape
                phone, a half-height desktop window) stays on the compact scale. */}
            <span className="font-mono text-xs text-grey-40 tracking-wider block mb-2 tall:mb-4">
                {exp.period}
            </span>

            <h3 className="text-3xl md:tall:text-4xl lg:tall:text-5xl font-bold mb-2 tall:mb-3 leading-tight">
                {exp.role}
            </h3>

            <p className="text-xl md:tall:text-2xl text-grey-40 mb-3 tall:mb-6">{exp.company}</p>

            <div className="text-grey-40 leading-relaxed mb-4 tall:mb-8 max-w-xl text-base md:tall:text-lg space-y-2 tall:space-y-3">
                {exp.description.map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </div>

            <div className="flex flex-wrap gap-2 tall:gap-3" role="list" aria-label="Technologies">
                {exp.technologies.map((tech) => (
                    <span
                        key={tech}
                        className="font-mono text-xs tracking-wide text-grey-40 px-3 py-1.5 border border-grey-80"
                        role="listitem"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </motion.article>
    );
}
