"use client";

import {useRef, useMemo} from "react";
import {
    motion,
    useScroll,
    useTransform,
    MotionValue,
    useReducedMotion,
} from "framer-motion";

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
        technologies: ["Node.js", "Typescript", "RabbitMQ", "PHP", "Shopware", "SAP", "Accessibility"],
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

export default function Experience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();

    const {scrollY} = useScroll();

    // Manually compute 0→1 progress scoped to this section.
    // useScroll({ target, offset: ["start start", "end end"] }) triggers FM's
    // WAAPI/ScrollTimeline HW-acceleration path (added in 12.37.0) which maps
    // keyframe offsets against the full-document scroll range instead of the
    // section range, breaking the animation. Manual calculation bypasses that.
    const scrollYProgress = useTransform(scrollY, (y) => {
        if (!containerRef.current) return 0;
        const top = containerRef.current.offsetTop;
        const height = containerRef.current.offsetHeight;
        const viewH = window.innerHeight;
        return Math.max(0, Math.min(1, (y - top) / (height - viewH)));
    });

    // Calculate phase boundaries
    // ADJUST THESE VALUES to control timing:
    // - introEnd: When title fades out (higher = stays longer)
    // - exitStart: When section ends (lower = ends sooner)
    const {introEnd, exitStart, experienceStep} = useMemo(() => {
        const introEnd = 0.15;
        const exitStart = 0.92;
        const experienceRange = exitStart - introEnd;
        const experienceStep = experienceRange / experiences.length;

        return {introEnd, exitStart, experienceStep};
    }, []);

    // Transform scroll progress to intro opacity (slower fade)
    const introOpacity = useTransform(
        scrollYProgress,
        [0, introEnd * 0.7, introEnd],
        [1, 1, 0], // Stays at full opacity longer, then fades
    );

    // Transform for content fade in (synced with title fade out)
    const contentOpacity = useTransform(
        scrollYProgress,
        [introEnd * 0.9, introEnd * 1.1],
        [0, 1], // Fades in AFTER title fades out
    );

    // Transform for timeline progress - continuous fill with scroll
    const timelineProgress = useTransform(
        scrollYProgress,
        [introEnd, exitStart],
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
                            introEnd={introEnd}
                            experienceStep={experienceStep}
                            timelineProgress={timelineProgress}
                            prefersReducedMotion={prefersReducedMotion}
                        />

                        {/* Mobile Timeline */}
                        <MobileTimeline
                            scrollYProgress={scrollYProgress}
                            introEnd={introEnd}
                            experienceStep={experienceStep}
                            timelineProgress={timelineProgress}
                            prefersReducedMotion={prefersReducedMotion}
                        />

                        {/* Experience content */}
                        <ExperienceContent
                            scrollYProgress={scrollYProgress}
                            introEnd={introEnd}
                            experienceStep={experienceStep}
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
                             introEnd,
                             experienceStep,
                             timelineProgress,
                             prefersReducedMotion,
                         }: {
    scrollYProgress: MotionValue<number>;
    introEnd: number;
    experienceStep: number;
    timelineProgress: MotionValue<number>;
    prefersReducedMotion: boolean | null;
}) {
    // Calculate total timeline height: dots * spacing between them
    // Each dot row is 52px high (py-4 = 32px + dot/text height ~20px)
    const timelineHeight = (experiences.length) * 52; // Space between dot centers

    return (
        <div
            className="hidden md:flex flex-col gap-0 relative py-4 min-w-[100px]"
            role="navigation"
            aria-label="Timeline"
        >
            {/* Timeline track - light gray background */}
            <div
                className="absolute left-[5px] w-px bg-[hsl(0_0%_85%)]"
                style={{height: `${timelineHeight}px`}}
            />

            {/* Progress indicator - fills gradually with scroll */}
            <motion.div
                className="absolute left-[5px] w-px bg-[hsl(0_0%_8%)]"
                style={
                    prefersReducedMotion
                        ? {height: `${timelineHeight}px`}
                        : {
                            height: `${timelineHeight}px`,
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
                    introEnd={introEnd}
                    experienceStep={experienceStep}
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
                         introEnd,
                         experienceStep,
                         prefersReducedMotion,
                     }: {
    exp: Experience;
    index: number;
    scrollYProgress: MotionValue<number>;
    introEnd: number;
    experienceStep: number;
    prefersReducedMotion: boolean | null;
}) {
    const expStart = introEnd + index * experienceStep;
    const expEnd = introEnd + (index + 1) * experienceStep;

    // Opacity: future = 0.3, current = 1, past = 0.6
    const dotOpacity = useTransform(
        scrollYProgress,
        [expStart - 0.01, expStart, expEnd, expEnd + 0.01],
        [0.3, 1, 0.6, 0.6], // Future → Current → Past
    );

    // Dot stays big for entire experience duration
    const dotScale = useTransform(
        scrollYProgress,
        [expStart - 0.01, expStart, expEnd, expEnd + 0.01],
        [1, 1.25, 1.25, 1], // Big throughout current experience
    );

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
                            introEnd,
                            experienceStep,
                            timelineProgress,
                            prefersReducedMotion,
                        }: {
    scrollYProgress: MotionValue<number>;
    introEnd: number;
    experienceStep: number;
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
                        introEnd={introEnd}
                        experienceStep={experienceStep}
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
                               introEnd,
                               experienceStep,
                               prefersReducedMotion,
                           }: {
    exp: Experience;
    index: number;
    scrollYProgress: MotionValue<number>;
    introEnd: number;
    experienceStep: number;
    prefersReducedMotion: boolean | null;
}) {
    const expStart = introEnd + index * experienceStep;
    const expEnd = introEnd + (index + 1) * experienceStep;

    // Opacity: future = 0.3, current = 1, past = 0.6
    const dotOpacity = useTransform(
        scrollYProgress,
        [expStart - 0.01, expStart, expEnd, expEnd + 0.01],
        [0.3, 1, 0.6, 0.6],
    );

    // Dot stays big for entire experience duration (same as desktop)
    const dotScale = useTransform(
        scrollYProgress,
        [expStart - 0.01, expStart, expEnd, expEnd + 0.01],
        [1, 1.25, 1.25, 1], // Same scale as desktop
    );

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
                               introEnd,
                               experienceStep,
                               prefersReducedMotion,
                           }: {
    scrollYProgress: MotionValue<number>;
    introEnd: number;
    experienceStep: number;
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
                    introEnd={introEnd}
                    experienceStep={experienceStep}
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
                            introEnd,
                            experienceStep,
                            prefersReducedMotion,
                        }: {
    exp: Experience;
    index: number;
    scrollYProgress: MotionValue<number>;
    introEnd: number;
    experienceStep: number;
    prefersReducedMotion: boolean | null;
}) {
    const expStart = introEnd + index * experienceStep;
    const expEnd = expStart + experienceStep;

    // Fade in during first 15%, full during middle, fade out during last 15%
    const cardOpacity = useTransform(
        scrollYProgress,
        [
            expStart,
            expStart + experienceStep * 0.15,
            expEnd - experienceStep * 0.15,
            expEnd,
        ],
        [0, 1, 1, index < experiences.length - 1 ? 0 : 1],
    );

    const cardY = useTransform(
        scrollYProgress,
        [expStart, expStart + experienceStep * 0.15],
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
