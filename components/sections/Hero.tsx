"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import ScrambleText from "@/components/ui/ScrambleText";
import TypeText from "@/components/ui/TypeText";
import HeroKeywords from "@/components/sections/HeroKeywords";
import { useFittedHeadline } from "@/lib/use-fitted-headline";

const HEADLINE = "Robert Kebinger";

/**
 * Typography that decides the fitted size. The hidden sizer and the <h1> have to
 * carry it identically, or the measured width is not the rendered width.
 * `headline-metrics` pulls in the kerning reset that globals.css otherwise
 * applies to `h1` by element selector.
 */
const HEADLINE_CLASS =
    "headline-metrics font-bold leading-[1.2] tracking-tighter whitespace-nowrap";

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
    const lenis = useLenis();
    const [hasAnimated, setHasAnimated] = useState(false);
    const { measureRef, fontSize, width } = useFittedHeadline({ settled: hasAnimated });

    const scrollToAbout = () => {
        lenis?.scrollTo("#about", {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.1,
        });
    };

    return (
        <section className="min-h-screen flex flex-col relative">
            {/*
              Sizer for useFittedHeadline. Hidden with `invisible` rather than
              `hidden`, because it still has to lay out for scrollWidth to mean
              anything, and held out of the a11y tree since the <h1> below
              already carries the real text.
            */}
            <div
                ref={measureRef}
                aria-hidden="true"
                className={`${HEADLINE_CLASS} absolute top-0 left-0 invisible pointer-events-none`}
            >
                {HEADLINE}
                <HeadlineCube />
            </div>

            <div className="flex-1 flex items-center pb-32 md:pb-40 lg:pb-48">
                <div className="w-full flex items-center justify-between px-[20px] md:px-[40px] lg:px-[80px]">
                    {/* Statement block */}
                    <motion.div
                        className="max-w-[520px] space-y-4"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: {},
                            visible: { transition: { staggerChildren: 0.22, delayChildren: 0.3 } },
                        }}
                    >
                        <motion.p
                            className="text-xl font-semibold"
                            variants={{
                                hidden: { opacity: 0, y: 14 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: { duration: 0.55, ease: "easeOut" },
                                },
                            }}
                        >
                            <span className="inline-block bg-grey-10 text-white font-mono px-1 py-0.5">
                                Frontend-focused
                            </span>{" "}
                            Full-Stack Developer
                        </motion.p>

                        <HeroKeywords start={hasAnimated} />
                    </motion.div>
                </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                <h1
                    className={HEADLINE_CLASS}
                    style={{
                        opacity: fontSize ? 1 : 0,
                        fontSize: fontSize ?? "10px",
                        /*
                          Pinned to the measured width for the reveal only.
                          TypeText swaps the character it is revealing for a
                          random symbol, so the natural width changes on every
                          tick — under `justify-center` that swings the whole
                          headline sideways. Once the real text is in place the
                          natural width is the right one.
                        */
                        width: hasAnimated || width === null ? "auto" : `${width}px`,
                    }}
                >
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
                    {!hasAnimated && fontSize !== null && (
                        <TypeText
                            text={HEADLINE}
                            speed={50}
                            invertBox={{
                                backgroundColor: "#141414",
                                textColor: "#f8f6f2",
                            }}
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
                    text="[scroll to explore]"
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
