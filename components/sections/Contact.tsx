"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimate } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import ScrambleText from "@/components/ui/ScrambleText";

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
                await animate(
                    scope.current,
                    { opacity: [1, 0, 1] },
                    { duration: 0.08, ease: "linear" }
                );
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
    }, [inView, animate, scope]);

    return (
        <span
            ref={scope}
            className="inline-block align-middle ml-[0.2em] w-[0.32em] h-[0.32em] bg-paper"
        />
    );
}

const email = "hello@robertkebinger.com";

const socials = [
    { label: "GitHub", href: "https://github.com/kebrob" },
    { label: "LinkedIn", href: "https://linkedin.com/in/robert-kebinger-481166204" },
    { label: "Instagram", href: "https://instagram.com/robertkebinger" },
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

    /*
     * -mt-px closes a hairline seam at the top edge, from back when this footer
     * and the section above it both painted their own grey-6 and Firefox snapped
     * the two backgrounds to device pixels independently. Neither paints one any
     * more — the dark under both is the same fixed canvas — so there is no seam
     * left to close, but the overlap costs nothing and the day either of them
     * paints a ground again it is wanted.
     */
    return (
        <footer
            id="contact"
            className="dark-section -mt-px px-[20px] md:px-[40px] lg:px-[80px] pt-20 pb-6 text-paper min-h-screen flex flex-col justify-between"
            /*
             * Same move as the projects wall above: keep .dark-section for its
             * text colour and because the Header's intersection check watches
             * that class, but drop the background it normally paints.
             *
             * The footer used to be flatly dark from its first pixel while the
             * ink was still flooding in above it, so scrolling down fast met a
             * hard horizontal edge where the finished dark met the transition.
             * Transparent, the same canvas paints both and there is no edge to
             * see. It is also the same surface either way: .dark-section's
             * background is grey-6 with a 2.5% dot lattice, and grey-6 with a
             * 2.5% dot lattice is exactly what the shader resolves to at density
             * 1 (see FRAG_MAIN in lib/ink/gl-transition.ts).
             *
             * The dots come from the canvas now rather than from here, which is
             * the one visible difference: painting both stacked two identical
             * lattices and doubled their opacity.
             */
            style={{ backgroundColor: "transparent", backgroundImage: "none" }}
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

            {/* Bottom row. The socials column is `auto`, not a second 1fr: its widest
                item is LINKEDIN at ~94px, whereas the email row needs ~440px ("Email me"
                + the 80px rule + a 24-char mono address). Splitting the width evenly
                starved the email column and made the address wrap onto a second line
                everywhere from md up to ~1024px. */}
            <div className="mt-32 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-y-12 gap-x-8 items-end">
                {/* Email me */}
                <div ref={emailRowRef} className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-base md:text-lg font-medium uppercase tracking-tight text-paper">
                        Email me
                    </span>
                    <motion.span
                        className="hidden sm:block h-px bg-paper"
                        initial={{ width: 0 }}
                        animate={emailRowInView ? { width: 80 } : {}}
                        transition={{ duration: 0.6, delay: 0.2, ease: STAGGER_EASE }}
                    />
                    <a
                        href={`mailto:${email}`}
                        onMouseEnter={() => setEmailHovered(true)}
                        onMouseLeave={() => setEmailHovered(false)}
                        // whitespace-nowrap keeps the address atomic. On hover ScrambleText
                        // swaps the single text node for one span per character, which
                        // introduces a line-break opportunity between every character —
                        // without this, hovering could re-wrap the chip mid-address.
                        className="group font-mono text-sm md:text-base hoverable inline-flex items-center gap-1.5 px-1 py-0.5 bg-paper text-ink leading-snug whitespace-nowrap"
                    >
                        {emailHovered ? (
                            <ScrambleText
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
                                className="group font-mono text-sm uppercase tracking-widest text-paper opacity-50 hover:opacity-100 transition-opacity hoverable inline-flex items-center gap-1"
                            >
                                {hoveredSocial === s.label ? (
                                    <ScrambleText
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
                <span className="font-mono text-xs text-grey-65">
                    © {new Date().getFullYear()} Robert Kebinger — All rights reserved
                </span>
            </div>
        </footer>
    );
}
