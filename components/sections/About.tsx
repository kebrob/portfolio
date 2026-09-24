"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import { EASE_OUT_EXPO as EASE } from "@/lib/palette";

/** `yearsOfExperience` is resolved at build by app/[locale]/page.tsx — see the note there. */
export default function About({ yearsOfExperience }: { yearsOfExperience: number }) {
    const sectionRef = useRef(null);
    const inView = useInView(sectionRef, { once: true, amount: 0.15 });
    const t = useTranslations("about");

    // Split on spaces for the word stagger. Korean separates words with spaces
    // too, so this holds for every language the site is planned for.
    const headingWords = t("heading").split(" ");

    const paragraphs = [t("intro"), t("stack")];

    const stats = [
        { value: t("yearsValue", { count: yearsOfExperience }), label: t("yearsLabel") },
        { value: t("toolsValue"), label: t("toolsLabel") },
    ];

    return (
        // From md up the section is a screen tall with its content centred, the
        // way the hero and the Experience cards sit. Below md the content is
        // taller than the screen, so it keeps fixed padding.
        <section
            id="about"
            ref={sectionRef}
            className="px-gutter pt-44 pb-24 md:min-h-screen md:flex md:flex-col md:justify-center md:py-24"
        >
            <div className="w-full max-w-6xl mx-auto">
                <motion.span
                    className="font-mono text-xs uppercase tracking-label mb-16 block"
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {t("eyebrow")}
                </motion.span>

                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-[1.1] tracking-tight mb-6 lg:mb-8 overflow-hidden">
                    {headingWords.map((word, i) => (
                        <motion.span
                            key={i}
                            className="inline-block mr-[0.3em]"
                            initial={{ opacity: 0, y: 28 }}
                            animate={inView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.055, ease: EASE }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </h2>

                <div className="grid md:grid-cols-12 gap-8 md:gap-8">
                    <div className="md:col-span-3 me-5">
                        {/* Stays unrotated — border and tape are positioned against this, not the tilted photo. */}
                        <div className="relative group max-w-50">
                            <motion.div
                                className="absolute -bottom-3 -right-3 w-full h-full -z-10"
                                style={{ border: "1px solid rgba(0,0,0,0.15)" }}
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.4, delay: 0.9, ease: "easeOut" }}
                            />
                            <motion.div
                                className="aspect-square md:aspect-3/4 overflow-hidden bg-white relative"
                                style={{ rotate: -0.6, x: 4, y: 4, padding: "8px 8px 28px 8px" }}
                                initial={{ clipPath: "inset(0 0 100% 0)" }}
                                animate={inView ? { clipPath: "inset(0 0 0% 0)" } : {}}
                                transition={{ duration: 0.9, delay: 0.2, ease: EASE }}
                            >
                                <div className="relative w-full h-full">
                                    <Image
                                        src="/images/portrait.jpg"
                                        alt={t("portraitAlt")}
                                        fill
                                        sizes="200px"
                                        loading="lazy"
                                        quality={85}
                                        className="object-cover object-top"
                                    />
                                </div>
                            </motion.div>
                            {/* Tape strips: translate before rotate puts each strip's centre exactly on its corner. */}
                            <motion.div
                                className="absolute z-10 pointer-events-none"
                                style={{
                                    top: 12,
                                    right: 6,
                                    width: "70px",
                                    height: "18px",
                                    transform: "translate(50%, -50%) rotate(45deg)",
                                    background:
                                        "linear-gradient(180deg, rgba(225,225,222,0.48) 0%, rgba(195,193,188,0.52) 100%)",
                                    boxShadow:
                                        "0 1px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(150,148,142,0.15)",
                                    clipPath:
                                        "polygon(6% 0%, 92% 3%, 98% 0%, 100% 24%, 96% 50%, 100% 74%, 95% 100%, 9% 97%, 0% 78%, 5% 52%, 1% 28%, 0% 8%)",
                                }}
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.35, delay: 1.05 }}
                            />
                            <motion.div
                                className="absolute z-10 pointer-events-none"
                                style={{
                                    bottom: 5,
                                    left: 6,
                                    width: "60px",
                                    height: "18px",
                                    transform: "translate(-50%, 50%) rotate(45deg)",
                                    background:
                                        "linear-gradient(180deg, rgba(225,225,222,0.48) 0%, rgba(195,193,188,0.52) 100%)",
                                    boxShadow:
                                        "0 1px 4px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(150,148,142,0.15)",
                                    clipPath:
                                        "polygon(3% 0%, 7% 5%, 4% 15%, 8% 2%, 94% 3%, 100% 20%, 97% 48%, 99% 80%, 100% 100%, 91% 97%, 6% 100%, 0% 72%, 3% 44%, 0% 18%)",
                                }}
                                initial={{ opacity: 0 }}
                                animate={inView ? { opacity: 1 } : {}}
                                transition={{ duration: 0.35, delay: 1.15 }}
                            />
                        </div>
                    </div>

                    <div className="md:col-span-9 max-w-xl space-y-8">
                        <div className="space-y-6">
                            {paragraphs.map((p, i) => (
                                <motion.p
                                    key={i}
                                    className="leading-relaxed"
                                    style={{ fontSize: i === 0 ? "1.125rem" : "1rem" }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={inView ? { opacity: 1, y: 0 } : {}}
                                    transition={{
                                        duration: 0.6,
                                        delay: 0.3 + i * 0.15,
                                        ease: EASE,
                                    }}
                                >
                                    {p}
                                </motion.p>
                            ))}
                        </div>

                        <div className="pt-8 relative">
                            <motion.div
                                className="absolute top-0 left-0 h-px bg-black"
                                initial={{ width: "0%" }}
                                animate={inView ? { width: "100%" } : {}}
                                transition={{ duration: 0.7, delay: 0.55, ease: EASE }}
                            />
                            <div className="grid grid-cols-2 gap-8 mt-1 items-start">
                                {/* flex-wrap: on the narrowest phones the label drops
                                    under its number instead of pushing the page wider. */}
                                {stats.map(({ value, label }, i) => (
                                    <motion.div
                                        key={label}
                                        className="flex min-w-0 flex-row flex-wrap items-center gap-3"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{
                                            duration: 0.5,
                                            delay: 0.85 + i * 0.1,
                                            ease: EASE,
                                        }}
                                    >
                                        <span className="text-3xl font-bold leading-none shrink-0">
                                            {value}
                                        </span>
                                        <p className="font-mono text-xs uppercase tracking-wider">
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
