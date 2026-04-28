"use client";

import {useRef} from "react";
import Image from "next/image";
import {motion, useInView} from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function About() {
    const startDate = new Date("2019-08-05");
    const now = new Date();
    const yearsOfExperience = Math.floor(
        (now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );

    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, {once: true, amount: 0.15});

    const headingWords = "Building digital products with precision and purpose.".split(" ");

    const paragraphs = [
        "I'm a developer based in Rosenheim, Germany, focused on building fast, intuitive interfaces with a strong attention to detail. I care about clean structure, maintainability, and creating experiences that feel effortless to use.",
        "While my main focus is frontend quality, I also work across the stack by turning ideas into complete, production-ready applications from concept to deployment.",
    ];

    const stats = [
        {value: `${yearsOfExperience}+`, label: "Years Experience"},
        {value: "35+", label: "Technologies & Tools"},
    ];

    return (
        <section id="about" ref={sectionRef} className="px-5 md:px-10 lg:px-20 py-32">
            <div className="max-w-6xl mx-auto">
                <motion.span
                    className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground mb-16 block"
                    initial={{opacity: 0}}
                    animate={inView ? {opacity: 1} : {}}
                    transition={{duration: 0.5, ease: "easeOut"}}
                >
                    About
                </motion.span>

                {/* Heading word stagger */}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight mb-6 lg:mb-8 overflow-hidden">
                    {headingWords.map((word, i) => (
                        <motion.span
                            key={i}
                            className="inline-block mr-[0.3em]"
                            initial={{opacity: 0, y: 28}}
                            animate={inView ? {opacity: 1, y: 0} : {}}
                            transition={{duration: 0.5, delay: 0.1 + i * 0.055, ease: EASE}}
                        >
                            {word}
                        </motion.span>
                    ))}
                </h2>

                <div className="grid md:grid-cols-12 gap-8 md:gap-8">
                    {/* Photo — clip-path wipe */}
                    <div className="md:col-span-3 me-5">
                        {/* Outer wrapper stays unrotated — border + tape are relative to this */}
                        <div className="relative group max-w-50">
                            {/* Decorative border stays straight — the "placeholder" in the textbook */}
                            <motion.div
                                className="absolute -bottom-3 -right-3 w-full h-full -z-10"
                                style={{border: "1px solid rgba(0,0,0,0.15)"}}
                                initial={{opacity: 0}}
                                animate={inView ? {opacity: 1} : {}}
                                transition={{duration: 0.4, delay: 0.9, ease: "easeOut"}}
                            />
                            {/* Photo is slightly tilted — looks like it was taped in off-angle */}
                            <motion.div
                                className="aspect-square md:aspect-3/4 overflow-hidden bg-white relative"
                                style={{rotate: -0.6, x: 4, y: 4, padding: "8px 8px 28px 8px"}}
                                initial={{clipPath: "inset(0 0 100% 0)"}}
                                animate={inView ? {clipPath: "inset(0 0 0% 0)"} : {}}
                                transition={{duration: 0.9, delay: 0.2, ease: EASE}}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/images/portrait.jpg"
                                        alt="Robert Kebinger"
                                        fill
                                        sizes="200px"
                                        loading="lazy"
                                        quality={85}
                                        className="object-cover object-top"
                                    />
                                </div>
                                <div
                                    className="absolute inset-0 bg-foreground/5 group-hover:bg-transparent transition-colors duration-500"/>
                            </motion.div>
                            {/*
                              Tape strips: center placed exactly at each corner via translate before rotate.
                              translate(50%, -50%) → center at top-right corner.
                              translate(-50%, 50%) → center at bottom-left corner.
                              Both ends overflow the photo onto the surrounding background.
                            */}
                            <motion.div
                                className="absolute z-10 pointer-events-none"
                                style={{
                                    top: 12, right: 6,
                                    width: "70px", height: "18px",
                                    transform: "translate(50%, -50%) rotate(45deg)",
                                    background: "linear-gradient(180deg, rgba(225,225,222,0.48) 0%, rgba(195,193,188,0.52) 100%)",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(150,148,142,0.15)",
                                    /* left end: single deep notch; right end: two subtle bumps */
                                    clipPath: "polygon(6% 0%, 92% 3%, 98% 0%, 100% 24%, 96% 50%, 100% 74%, 95% 100%, 9% 97%, 0% 78%, 5% 52%, 1% 28%, 0% 8%)",
                                }}
                                initial={{opacity: 0}}
                                animate={inView ? {opacity: 1} : {}}
                                transition={{duration: 0.35, delay: 1.05}}
                            />
                            <motion.div
                                className="absolute z-10 pointer-events-none"
                                style={{
                                    bottom: 5, left: 6,
                                    width: "60px", height: "18px",
                                    transform: "translate(-50%, 50%) rotate(45deg)",
                                    background: "linear-gradient(180deg, rgba(225,225,222,0.48) 0%, rgba(195,193,188,0.52) 100%)",
                                    boxShadow: "0 1px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(150,148,142,0.15)",
                                    /* left end: wider irregular tear + small nick; right end: concave pull */
                                    clipPath: "polygon(3% 0%, 7% 5%, 4% 15%, 8% 2%, 94% 3%, 100% 20%, 97% 48%, 99% 80%, 100% 100%, 91% 97%, 6% 100%, 0% 72%, 3% 44%, 0% 18%)",
                                }}
                                initial={{opacity: 0}}
                                animate={inView ? {opacity: 1} : {}}
                                transition={{duration: 0.35, delay: 1.15}}
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="md:col-span-9 max-w-xl space-y-8">
                        {/* Paragraphs — stagger fade up */}
                        <div className="space-y-6">
                            {paragraphs.map((p, i) => (
                                <motion.p
                                    key={i}
                                    className="text-muted-foreground leading-relaxed"
                                    style={{fontSize: i === 0 ? "1.125rem" : "1rem"}}
                                    initial={{opacity: 0, y: 20}}
                                    animate={inView ? {opacity: 1, y: 0} : {}}
                                    transition={{duration: 0.6, delay: 0.3 + i * 0.15, ease: EASE}}
                                >
                                    {p}
                                </motion.p>
                            ))}
                        </div>

                        {/* Stats — border draws, then items stagger up */}
                        <div className="pt-8 relative">
                            {/* Border draw */}
                            <motion.div
                                className="absolute top-0 left-0 h-px bg-black"
                                initial={{width: "0%"}}
                                animate={inView ? {width: "100%"} : {}}
                                transition={{duration: 0.7, delay: 0.55, ease: EASE}}
                            />
                            <div className="grid grid-cols-2 gap-8 mt-1 items-start">
                                {stats.map(({value, label}, i) => (
                                    <motion.div
                                        key={label}
                                        className="flex flex-row items-center gap-3"
                                        initial={{opacity: 0, y: 16}}
                                        animate={inView ? {opacity: 1, y: 0} : {}}
                                        transition={{duration: 0.5, delay: 0.85 + i * 0.1, ease: EASE}}
                                    >
                                        <span className="text-3xl font-bold leading-none shrink-0">{value}</span>
                                        <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                                            {label}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
