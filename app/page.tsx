"use client";

import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "start start"],
    });

    const darkProgress = useTransform(scrollYProgress, [0, 0.7], [0, 1]);

    return (
        <>
            <Hero />
            <About />
            <Experience />

            <div ref={containerRef} className="relative">
                {/* Dark veil with dot pattern that fades in */}
                <motion.div
                    className="fixed inset-0 pointer-events-none z-10"
                    style={{
                        opacity: darkProgress,
                        backgroundColor: "hsl(0 0% 6%)",
                        backgroundImage:
                            "radial-gradient(circle, hsl(0 0% 100% / 0.025) 1.5px, transparent 1.5px)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "0 0",
                    }}
                />

                <div className="relative z-20">
                    <Projects />
                    <Contact />
                </div>
            </div>
        </>
    );
}
