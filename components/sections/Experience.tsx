"use client";

import {useRef} from "react";
import {
    motion,
    useTransform,
    MotionValue,
    useReducedMotion,
} from "framer-motion";
import {useSectionProgress} from "@/lib/use-section-progress";

interface Experience {
    year: string;
    period: string;
    role: string;
    company: string;
    description: string[];
    technologies: string[];
}

const experiences: Experience[] = [
    {
        year: "2024",
        period: "Jun 2024 — Present",
        role: "Frontend Lead",
        company: "Calida Group Digital GmbH",
        description: [
            "Leading frontend architecture and UI consistency across projects while mentoring developers and guiding implementation quality.",
            "Currently building customer systems including CRM tools, email workflows, and SAP CRM integrations.",
        ],
        technologies: ["Node.js", "Typescript", "RabbitMQ", "PHP", "Shopware", "SAP", "AI"],
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

// Phase boundaries within the section's 0→1 scroll progress.
// ADJUST THESE VALUES to control timing:
// - INTRO_END: When title fades out (higher = stays longer)
// - EXIT_START: When section ends (lower = ends sooner)
const INTRO_END = 0.15;
const EXIT_START = 0.92;
const EXPERIENCE_STEP = (EXIT_START - INTRO_END) / experiences.length;

// Total timeline height: dots * spacing between them.
// Each dot row is 52px high (py-4 = 32px + dot/text height ~20px)
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
    const prefersReducedMotion = useReducedMotion();

    const scrollYProgress = useSectionProgress(containerRef);

    // Transform scroll progress to intro opacity (slower fade)
    const introOpacity = useTransform(
        scrollYProgress,
        [0, INTRO_END * 0.7, INTRO_END],
        [1, 1, 0], // Stays at full opacity longer, then fades
    );

    // Transform for content fade in (synced with title fade out)
    const contentOpacity = useTransform(
        scrollYProgress,
        [INTRO_END * 0.9, INTRO_END * 1.1],
        [0, 1], // Fades in AFTER title fades out
    );

    // Transform for timeline progress - continuous fill with scroll
    const timelineProgress = useTransform(
        scrollYProgress,
        [INTRO_END, EXIT_START],
        [0, 1],
    );

    return (
        <section
            ref={containerRef}
            className="relative"
            style={{height: `${(experiences.length + 2) * 100}vh`}}
            aria-label="Work Experience"
        >
            {/* Sticky container */}
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <div className="w-full max-w-6xl mx-auto px-[20px] md:px-[40px] lg:px-[80px]">
                    {/* Intro headline */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{opacity: prefersReducedMotion ? 1 : introOpacity}}
                        aria-hidden={prefersReducedMotion ? "false" : undefined}
                    >
                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                            Experience
                        </h2>
                    </motion.div>

                    {/* Main content - timeline + experience */}
                    <motion.div
                        className="flex flex-col md:flex-row gap-8 md:gap-16 lg:gap-24 items-start"
                        style={{
                            opacity: prefersReducedMotion ? 1 : contentOpacity,
                        }}
                    >
                        {/* Desktop Timeline */}
                        <DesktopTimeline
                            scrollYProgress={scrollYProgress}
                            timelineProgress={timelineProgress}
                            prefersReducedMotion={prefersReducedMotion}
                        />

                        {/* Mobile Timeline */}
                        <MobileTimeline
                            scrollYProgress={scrollYProgress}
                            timelineProgress={timelineProgress}
                            prefersReducedMotion={prefersReducedMotion}
                        />

                        {/* Experience content */}
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

// Desktop Timeline Component
function DesktopTimeline({
                             scrollYProgress,
                             timelineProgress,
                             prefersReducedMotion,
                         }: {
    scrollYProgress: MotionValue<number>;
    timelineProgress: MotionValue<number>;
    prefersReducedMotion: boolean | null;
}) {
    return (
        <div
            className="hidden md:flex flex-col gap-0 relative py-4 min-w-[100px]"
            role="navigation"
            aria-label="Timeline"
        >
            {/* Timeline track - light gray background */}
            <div
                className="absolute left-[5px] w-px bg-[hsl(0_0%_85%)]"
                style={{height: `${TIMELINE_HEIGHT}px`}}
            />

            {/* Progress indicator - fills gradually with scroll */}
            <motion.div
                className="absolute left-[5px] w-px bg-[hsl(0_0%_8%)]"
                style={
                    prefersReducedMotion
                        ? {height: `${TIMELINE_HEIGHT}px`}
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

// Timeline Dot Component
function TimelineDot({
                         exp,
                         index,
                         scrollYProgress,
                         prefersReducedMotion,
                     }: {
    exp: Experience;
    index: number;
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean | null;
}) {
    const {opacity: dotOpacity, scale: dotScale} = useDotTransforms(scrollYProgress, index);

    return (
        <motion.div
            className="flex items-center gap-4 py-4"
            style={
                prefersReducedMotion
                    ? {opacity: 1}
                    : {opacity: dotOpacity}
            }
        >
            <motion.div
                className="w-[11px] h-[11px] rounded-full border-2 border-[hsl(0_0%_8%)] bg-[hsl(0_0%_8%)] z-10"
                style={prefersReducedMotion ? {} : {scale: dotScale}}
            />
            <span className="font-mono text-sm tracking-wider text-[hsl(0_0%_8%)]">
                {exp.year}
            </span>
        </motion.div>
    );
}

// Mobile Timeline Component - Horizontal with progress line
function MobileTimeline({
                            scrollYProgress,
                            timelineProgress,
                            prefersReducedMotion,
                        }: {
    scrollYProgress: MotionValue<number>;
    timelineProgress: MotionValue<number>;
    prefersReducedMotion: boolean | null;
}) {
    return (
        <div
            className="flex md:hidden relative w-full mb-8 px-4"
            role="navigation"
            aria-label="Timeline"
        >
            <div className="flex justify-between items-start w-full relative">
                {/* Timeline track - horizontal, positioned at dot center */}
                <div className="absolute left-0 right-0 top-[5.5px] h-px bg-[hsl(0_0%_85%)]"/>

                {/* Progress indicator - fills horizontally with scroll */}
                <motion.div
                    className="absolute left-0 top-[5.5px] h-px bg-[hsl(0_0%_8%)]"
                    style={
                        prefersReducedMotion
                            ? {width: "100%"}
                            : {
                                scaleX: timelineProgress,
                                transformOrigin: "left",
                                width: "100%",
                            }
                    }
                />

                {/* Dots */}
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

// Mobile Timeline Dot Component
function MobileTimelineDot({
                               exp,
                               index,
                               scrollYProgress,
                               prefersReducedMotion,
                           }: {
    exp: Experience;
    index: number;
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean | null;
}) {
    const {opacity: dotOpacity, scale: dotScale} = useDotTransforms(scrollYProgress, index);

    return (
        <motion.div
            className="flex flex-col items-center gap-2 relative z-10"
            style={prefersReducedMotion ? {opacity: 1} : {opacity: dotOpacity}}
        >
            <motion.div
                className="w-[11px] h-[11px] rounded-full bg-[hsl(0_0%_8%)] border-2 border-[hsl(0_0%_8%)]"
                style={prefersReducedMotion ? {} : {scale: dotScale}}
            />
            <span className="font-mono text-xs text-center tracking-wider">{exp.year}</span>
        </motion.div>
    );
}

// Experience Content Component
function ExperienceContent({
                               scrollYProgress,
                               prefersReducedMotion,
                           }: {
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean | null;
}) {
    return (
        <div className="flex-1 relative min-h-[350px] w-full">
            {/* minHeight keeps content centered vertically in sticky container */}
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

// Experience Card Component
function ExperienceCard({
                            exp,
                            index,
                            scrollYProgress,
                            prefersReducedMotion,
                        }: {
    exp: Experience;
    index: number;
    scrollYProgress: MotionValue<number>;
    prefersReducedMotion: boolean | null;
}) {
    const expStart = INTRO_END + index * EXPERIENCE_STEP;
    const expEnd = expStart + EXPERIENCE_STEP;

    // Fade in during first 15%, full during middle, fade out during last 15%
    const cardOpacity = useTransform(
        scrollYProgress,
        [
            expStart,
            expStart + EXPERIENCE_STEP * 0.15,
            expEnd - EXPERIENCE_STEP * 0.15,
            expEnd,
        ],
        [0, 1, 1, index < experiences.length - 1 ? 0 : 1],
    );

    const cardY = useTransform(
        scrollYProgress,
        [expStart, expStart + EXPERIENCE_STEP * 0.15],
        [20, 0],
    );

    return (
        <motion.article
            className="absolute inset-0 w-full"
            style={
                prefersReducedMotion
                    ? {opacity: 1}
                    : {
                        opacity: cardOpacity,
                        y: cardY,
                    }
            }
            aria-label={`${exp.role} at ${exp.company}`}
        >
            <span className="font-mono text-xs text-[hsl(0_0%_40%)] tracking-wider block mb-4">
                {exp.period}
            </span>

            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 leading-tight">
                {exp.role}
            </h3>

            <p className="text-xl md:text-2xl text-[hsl(0_0%_40%)] mb-6">
                {exp.company}
            </p>

            <div className="text-[hsl(0_0%_40%)] leading-relaxed mb-8 max-w-xl text-base md:text-lg space-y-3">
                {exp.description.map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </div>

            <div className="flex flex-wrap gap-3" role="list" aria-label="Technologies">
                {exp.technologies.map((tech) => (
                    <span
                        key={tech}
                        className="font-mono text-xs tracking-wide text-[hsl(0_0%_40%)] px-3 py-1.5 border border-[hsl(0_0%_80%)]"
                        role="listitem"
                    >
                        {tech}
                    </span>
                ))}
            </div>
        </motion.article>
    );
}
