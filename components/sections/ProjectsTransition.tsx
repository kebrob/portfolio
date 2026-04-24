"use client";

import {useRef} from "react";
import {ChevronDown} from "lucide-react";
import {motion, useScroll, useTransform, useReducedMotion, useMotionValueEvent} from "framer-motion";
import Projects from "@/components/sections/Projects";
import {useHeaderTheme} from "@/lib/header-theme";

// Animation constants — update these if you change the container height or keyframes.
// Sentinel positions are derived from these values, so nothing else needs to change.
const CONTAINER_VH = 340;
const DARK_OVERLAY_START = 0.28;
const DARK_OVERLAY_END = 0.68;
const PROJECTS_VISIBLE_END = 0.78;

// scrollRange = how many vh the page travels while the sticky panel is pinned
const SCROLL_RANGE = CONTAINER_VH - 100;
// Nav anchor: scroll target where projects are fully faded in
const PROJECTS_ANCHOR_TOP_VH = PROJECTS_VISIBLE_END * SCROLL_RANGE;

export default function ProjectsTransition() {
    const containerRef = useRef<HTMLDivElement>(null);
    const prefersReducedMotion = useReducedMotion();
    const {setForceDark} = useHeaderTheme();

    const {scrollY} = useScroll();

    // Manually compute 0→1 progress scoped to this section (same pattern as Experience)
    const scrollYProgress = useTransform(scrollY, (y) => {
        if (!containerRef.current) return 0;
        const top = containerRef.current.offsetTop;
        const height = containerRef.current.offsetHeight;
        const viewH = window.innerHeight;
        return Math.max(0, Math.min(1, (y - top) / (height - viewH)));
    });

    // Phase 1 (0 → 0.08): title fades in almost immediately
    // Phase 2 (0.08 → 0.35): title is fully visible on white bg
    // Phase 3 (0.35 → 0.55): title fades out + dark overlay fades in
    // Phase 4 (0.55 → 0.75): projects fade in while still sticky
    // Phase 5 (0.75 → 1): projects fully visible, user can interact before pin releases

    // Title starts fully visible (like Experience) and scrolls to position, then fades out
    const titleOpacity = useTransform(
        scrollYProgress,
        [0, 0.35, 0.55],
        [1, 1, 0],
    );

    const darkOverlayOpacity = useTransform(
        scrollYProgress,
        [DARK_OVERLAY_START, DARK_OVERLAY_END],
        [0, 1],
    );

    // Drive the header theme directly from the overlay opacity — no DOM sentinel needed
    useMotionValueEvent(darkOverlayOpacity, "change", (v) => setForceDark(v > 0.5));

    const projectsOpacity = useTransform(
        scrollYProgress,
        [0.55, PROJECTS_VISIBLE_END],
        [0, 1],
    );

    const projectsPointerEvents = useTransform(projectsOpacity, (v) =>
        v > 0.5 ? "auto" : "none",
    );

    const hintOpacity = useTransform(
        scrollYProgress,
        [DARK_OVERLAY_END, DARK_OVERLAY_END + 0.05, 0.99, 1],
        [0, 1, 1, 0],
    );

    return (
        // CONTAINER_VH gives enough scroll distance for all phases without feeling sluggish
        <div ref={containerRef} className="relative" style={{height: `${CONTAINER_VH}vh`}}>
            <div className="sticky top-0 h-screen overflow-hidden">
                {/* Dark background overlay */}
                <motion.div
                    className="absolute inset-0"
                    style={
                        prefersReducedMotion
                            ? {
                                opacity: 1,
                                backgroundColor: "hsl(0 0% 6%)",
                                backgroundImage:
                                    "radial-gradient(circle, hsl(0 0% 100% / 0.025) 1.5px, transparent 1.5px)",
                                backgroundSize: "20px 20px",
                            }
                            : {
                                opacity: darkOverlayOpacity,
                                backgroundColor: "hsl(0 0% 6%)",
                                backgroundImage:
                                    "radial-gradient(circle, hsl(0 0% 100% / 0.025) 1.5px, transparent 1.5px)",
                                backgroundSize: "20px 20px",
                            }
                    }
                />

                {/* "Selected Work" title — fades in quickly, then fades out as bg turns dark */}
                <motion.div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                    style={prefersReducedMotion ? {opacity: 0} : {opacity: titleOpacity}}
                >
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-[hsl(0_0%_8%)]">
                        Selected Work
                    </h2>
                </motion.div>

                {/* Projects section — fades in once bg is black */}
                <motion.div
                    className="absolute inset-0 z-20"
                    style={
                        prefersReducedMotion
                            ? {opacity: 1, pointerEvents: "auto"}
                            : {opacity: projectsOpacity, pointerEvents: projectsPointerEvents}
                    }
                >
                    <Projects/>
                </motion.div>

                {/* Scroll hint — fades in as dark overlay finishes, fades out when section ends */}
                <motion.div
                    className="absolute bottom-6 left-0 right-0 flex justify-center pointer-events-none z-30"
                    style={prefersReducedMotion ? {opacity: 1} : {opacity: hintOpacity}}
                >
                    <ChevronDown className="w-7 h-7 text-[hsl(0_0%_40%)] animate-bounce"/>
                </motion.div>
            </div>

            {/* Nav anchor: scrolling to #projects lands here (projects fully faded in) */}
            <div
                id="projects"
                aria-hidden="true"
                className="pointer-events-none absolute left-0 w-0 h-0"
                style={{top: `${PROJECTS_ANCHOR_TOP_VH}vh`}}
            />
        </div>
    );
}
