"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimate } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import ScrambleText from "@/components/ui/ScrambleText";
import LegalLinks from "@/components/layout/LegalLinks";
import { EASE_OUT_EXPO, INK, PAPER } from "@/lib/palette";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { EMAIL as email, SOCIALS as socials } from "@/lib/site";

/*
 * Glitch square — starts 5s after in-view, then randomly single or double
 * glitches every 3–10s. Held still for reduced motion: it never stops on its
 * own, and a flicker that cannot be paused is exactly what that setting asks
 * a page not to do.
 */
function GlitchSquare() {
    const [scope, animate] = useAnimate();
    const inView = useInView(scope, { once: true });
    const reduced = usePrefersReducedMotion();

    useEffect(() => {
        if (!inView || reduced) return;
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
    }, [inView, reduced, animate, scope]);

    return (
        <span
            ref={scope}
            className="inline-block align-middle ml-[0.2em] w-[0.32em] h-[0.32em] bg-paper"
        />
    );
}

const socialInvertBox = { backgroundColor: PAPER, textColor: INK };
const emailInvertBox = { backgroundColor: INK, textColor: PAPER };

const STAGGER_EASE = EASE_OUT_EXPO;

/** `year` is resolved at build by app/[locale]/page.tsx — see the note there. */
export default function Contact({ year }: { year: number }) {
    const t = useTranslations("contact");
    const tA11y = useTranslations("a11y");
    const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);
    const [emailHovered, setEmailHovered] = useState(false);

    const headlineRef = useRef(null);
    const headlineInView = useInView(headlineRef, { once: true, amount: 0.3 });

    const emailRowRef = useRef(null);
    const emailRowInView = useInView(emailRowRef, { once: true, amount: 0.5 });

    const headline = t.raw("headline") as string[];
    const lines = headline.map((text, i) => ({
        text,
        offset: i > 0,
        // `nowrap` only on a line that has a space in it — the others cannot
        // break anyway, and the clamp()'d type gets very close to the edge.
        nowrap: text.includes(" "),
        isLast: i === headline.length - 1,
    }));

    /*
     * -mt-px guards against a hairline seam at the top edge should this footer
     * or the section above it ever paint a ground of its own again (Firefox
     * snaps the two backgrounds to device pixels independently).
     */
    return (
        <footer
            id="contact"
            /*
             * Full-screen only from lg. Below that, min-h-screen stretched the
             * content over the viewport and left two empty bands, so it is as
             * tall as its content.
             */
            className="dark-section -mt-px px-gutter pt-20 pb-6 text-paper lg:min-h-view lg:flex lg:flex-col lg:justify-between"
            /*
             * Same move as the projects wall above: keep .dark-section for its
             * text colour and because the Header's intersection check watches
             * that class, but drop the background it normally paints. Otherwise
             * scrolling down fast meets a hard edge where the finished dark meets
             * the flood, and the dot lattice is painted twice.
             */
            style={{ backgroundColor: "transparent", backgroundImage: "none" }}
        >
            <div ref={headlineRef} className="overflow-hidden">
                <h2 className="font-bold uppercase leading-[0.85] tracking-tight text-[clamp(3.5rem,13vw,13rem)]">
                    {lines.map((line, i) => (
                        <motion.span
                            key={line.text}
                            className={`block${line.nowrap ? " whitespace-nowrap" : ""}${line.offset ? " pl-[12vw] md:pl-[18vw]" : ""}`}
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

            {/* The socials column is `auto`, not a second 1fr: the email row needs
                ~440px and the socials ~94px, so an even split wrapped the address. */}
            <div className="mt-16 md:mt-24 lg:mt-32 grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto] gap-y-12 gap-x-8 items-end">
                <div ref={emailRowRef} className="flex items-center gap-2 flex-wrap min-w-0">
                    <span className="text-base md:text-lg font-medium uppercase tracking-tight text-paper">
                        {t("emailMe")}
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
                                <span className="sr-only">{tA11y("opensInNewTab")}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            <LegalLinks year={year} className="mt-16 lg:mt-12 text-grey-65" />
        </footer>
    );
}
