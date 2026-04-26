"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimate } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import TextAnimation from "@/components/ui/TextAnimation";

/* Glitch square — starts 5s after in-view, then randomly single or double glitches every 3–10s */
function GlitchSquare() {
    const [scope, animate] = useAnimate();
    const inView = useInView(scope, { once: true });

    useEffect(() => {
        if (!inView) return;
        let cancelled = false;
        let timeoutId: ReturnType<typeof setTimeout>;

        const doGlitch = async () => {
            if (cancelled) return;
            const isDouble = Math.random() > 0.5;

            await animate(scope.current, { opacity: [1, 0, 1] }, { duration: 0.1, ease: "linear" });

            if (isDouble && !cancelled) {
                await new Promise<void>((r) => setTimeout(r, 55));
                await animate(scope.current, { opacity: [1, 0, 1] }, { duration: 0.08, ease: "linear" });
            }

            if (!cancelled) {
                const next = 3000 + Math.random() * 7000;
                timeoutId = setTimeout(doGlitch, next);
            }
        };

        timeoutId = setTimeout(doGlitch, 5000);
        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [inView]);

    return (
        <span
            ref={scope}
            className="inline-block align-middle ml-[0.2em] w-[0.32em] h-[0.32em] bg-[hsl(45_30%_96%)]"
        />
    );
}

const email = "hello@robertkebinger.com";

const socials = [
    { label: "GitHub", href: "https://github.com/kebrob" },
    { label: "LinkedIn", href: "https://linkedin.com/in/robertkebinger" },
    { label: "Instagram", href: "https://instagram.com/robi.keb" },
];

const socialInvertBox = { backgroundColor: "#f8f6f2", textColor: "#141414" };
const emailInvertBox = { backgroundColor: "#141414", textColor: "#f8f6f2" };

const STAGGER_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function Contact() {
    const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
    const [emailHovered, setEmailHovered] = useState(false);

    const headlineRef = useRef(null);
    const headlineInView = useInView(headlineRef, { once: true, amount: 0.3 });

    const emailRowRef = useRef(null);
    const emailRowInView = useInView(emailRowRef, { once: true, amount: 0.5 });

    const lines = [
        { text: "Let\u2019s talk", offset: false, isLast: false },
        { text: "About", offset: true, isLast: false },
        { text: "IT", offset: true, isLast: true },
    ];

    return (
        <footer
            id="contact"
            className="dark-section px-[20px] md:px-[40px] lg:px-[80px] pt-20 pb-6 bg-[hsl(0_0%_6%)] text-[hsl(45_30%_96%)] min-h-screen flex flex-col justify-between"
        >
            {/* Headline */}
            <div ref={headlineRef} className="overflow-hidden">
                <h2 className="font-bold uppercase leading-[0.85] tracking-tight text-[clamp(3.5rem,13vw,13rem)]">
                    {lines.map((line, i) => (
                        <motion.span
                            key={line.text}
                            className={`block${line.text === "Let\u2019s talk" ? " whitespace-nowrap" : ""}${line.offset ? " pl-[12vw] md:pl-[18vw]" : ""}`}
                            initial={{ opacity: 0, y: 60 }}
                            animate={headlineInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.7, delay: i * 0.1, ease: STAGGER_EASE }}
                        >
                            {line.text}
                            {line.isLast && <GlitchSquare />}
                        </motion.span>
                    ))}
                </h2>
            </div>

            {/* Bottom row */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                {/* Email me */}
                <div ref={emailRowRef} className="flex items-center gap-2 flex-wrap">
                    <span className="text-base md:text-lg font-medium uppercase tracking-tight text-[hsl(45_30%_96%)]">
                        Email me
                    </span>
                    <motion.span
                        className="hidden sm:block h-px bg-[hsl(45_30%_96%)]"
                        initial={{ width: 0 }}
                        animate={emailRowInView ? { width: 80 } : {}}
                        transition={{ duration: 0.6, delay: 0.2, ease: STAGGER_EASE }}
                    />
                    <a
                        href={`mailto:${email}`}
                        onMouseEnter={() => setEmailHovered(true)}
                        onMouseLeave={() => setEmailHovered(false)}
                        className="group font-mono text-sm md:text-base hoverable inline-flex items-center gap-1.5 px-1 py-0.5 bg-[hsl(45_30%_96%)] text-[hsl(0_0%_8%)] leading-snug"
                    >
                        {emailHovered ? (
                            <TextAnimation
                                key="email-hover"
                                text={email}
                                loop={false}
                                speed={50}
                                invertBox={emailInvertBox}
                            />
                        ) : (
                            email
                        )}
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </div>

                {/* Socials */}
                <ul className="flex flex-col gap-2 md:items-end leading-tight">
                    {socials.map((s) => (
                        <li key={s.label}>
                            <a
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onMouseEnter={() => setHoveredSocial(s.label)}
                                onMouseLeave={() => setHoveredSocial(null)}
                                className="group font-mono text-sm uppercase tracking-widest text-[hsl(45_30%_96%)] opacity-50 hover:opacity-100 transition-opacity hoverable inline-flex items-center gap-1"
                            >
                                {hoveredSocial === s.label ? (
                                    <TextAnimation
                                        key={`social-${s.label}-hover`}
                                        text={s.label}
                                        loop={false}
                                        speed={50}
                                        invertBox={socialInvertBox}
                                    />
                                ) : (
                                    s.label
                                )}
                                <ArrowUpRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer */}
            <div className="mt-12">
                <span className="font-mono text-xs text-[hsl(0_0%_65%)]">
                    © {new Date().getFullYear()} Robert Kebinger
                </span>
            </div>
        </footer>
    );
}
