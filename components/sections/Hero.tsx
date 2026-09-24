"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import ScrambleText from "@/components/ui/ScrambleText";
import TypeText from "@/components/ui/TypeText";
import HeroKeywords from "@/components/sections/HeroKeywords";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { INK, PAPER } from "@/lib/palette";
import { AUTHOR, EMAIL } from "@/lib/site";

const HEADLINE = AUTHOR;

/**
 * Typography the fitted size in globals.css (.hero-headline) was measured
 * with. Change any of it — weight, tracking, the text, the cube — and the
 * constant there has to be re-measured.
 */
const HEADLINE_CLASS = "hero-headline font-bold leading-[1.2] tracking-tighter whitespace-nowrap";

/** The square trailing the headline. Sized in `em`, so it scales with the fit. */
function HeadlineCube({ "aria-hidden": ariaHidden }: { "aria-hidden"?: boolean }) {
    return (
        <span
            aria-hidden={ariaHidden}
            className="inline-block w-[0.15em] h-[0.15em] mx-1 align-middle bg-ink"
        />
    );
}

export default function Hero() {
    const t = useTranslations("hero");
    const lenis = useLenis();
    const reducedMotion = usePrefersReducedMotion();
    const [hasAnimated, setHasAnimated] = useState(false);

    const scrollToAbout = () => {
        lenis?.scrollTo("#about", {
            immediate: reducedMotion,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.1,
        });
    };

    return (
        <section className="min-h-view flex flex-col relative">
            <div className="flex-1 flex items-center pb-32 md:pb-40 lg:pb-48">
                <div className="w-full flex items-center justify-between px-gutter">
                    {/*
                      The entrance is a CSS animation, not a framer-motion one:
                      framer renders `initial` into the served HTML, so this
                      text — the LCP element — would stay at opacity 0 until
                      hydration. In CSS it starts on first paint.
                    */}
                    <div className="max-w-[520px] space-y-4">
                        <p className="hero-rise text-xl font-semibold">
                            {t.rich("role", {
                                chip: (chunks) => (
                                    <span className="inline-block bg-grey-10 text-white font-mono px-1 py-0.5">
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </p>

                        <HeroKeywords start={hasAnimated} />

                        {/* A text link rather than a second chip: two black boxes would compete. */}
                        <p className="hero-rise hero-rise-3 pt-4">
                            <a
                                href={`mailto:${EMAIL}`}
                                className="hoverable group inline-flex items-center gap-2 border-b border-ink/30 pb-1 font-mono text-xs tracking-caps uppercase transition-colors duration-300 hover:border-ink"
                            >
                                {t("emailCta")}
                                <span
                                    aria-hidden="true"
                                    className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                >
                                    ↗
                                </span>
                            </a>
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                {/*
                  Sized entirely in CSS — see .hero-headline in globals.css —
                  so the size is right in the served HTML and follows every
                  resize with no script. During the reveal the width is pinned
                  (.hero-headline-pinned): TypeText swaps the character it is
                  revealing for a random symbol, so the natural width changes
                  on every tick, and under `justify-center` that swings the
                  whole headline sideways. Once the real text is in place the
                  natural width is the right one.
                */}
                <h1 className={`${HEADLINE_CLASS} ${hasAnimated ? "" : "hero-headline-pinned"}`}>
                    {/*
                      The animation renders one span per character, which screen
                      readers announce letter by letter, and it starts empty so
                      the served HTML has no headline text at all. Carry the real
                      string here and hide the moving parts from the a11y tree.

                      Marked per element rather than through one wrapper span on
                      purpose: an extra inline box makes the cube's
                      `vertical-align: middle` resolve against the wrapper
                      instead of the heading, which drops it a pixel.
                    */}
                    <span className="sr-only">{HEADLINE}</span>
                    {hasAnimated && (
                        <>
                            <span aria-hidden="true">{HEADLINE}</span>
                            <HeadlineCube aria-hidden />
                        </>
                    )}
                    {!hasAnimated && (
                        <TypeText
                            text={HEADLINE}
                            speed={50}
                            invertBox={{ backgroundColor: INK, textColor: PAPER }}
                            startOnView={true}
                            onComplete={() => setHasAnimated(true)}
                            aria-hidden
                        />
                    )}
                </h1>
            </div>

            <button
                onClick={scrollToAbout}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase text-grey-40 hover:text-black transition-colors hoverable cursor-pointer"
            >
                <ScrambleText
                    text={t("scrollCue")}
                    invertBox={{
                        backgroundColor: "#000",
                        textColor: "#fff",
                    }}
                    speed={50}
                    delay={2}
                />
            </button>
        </section>
    );
}
