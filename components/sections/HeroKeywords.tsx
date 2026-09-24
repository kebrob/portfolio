"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const KEYWORDS = ["architecture", "performance", "detail"] as const;

/** Each keyword lights up in turn, then they all settle back. */
const HIGHLIGHT_STEPS: { at: number; idx: number | null }[] = [
    { at: 500, idx: 0 },
    { at: 1000, idx: 1 },
    { at: 1500, idx: 2 },
    { at: 2000, idx: null },
];

interface HeroKeywordsProps {
    /** Flips to true when the headline reveal finishes, running the sequence once. */
    start: boolean;
}

/**
 * The statement line, with its keywords picked out one after another.
 *
 * Rendered inside Hero's stagger container: `variants` resolves through
 * framer-motion's context, so the parent's `staggerChildren` still drives the
 * entrance from across the component boundary.
 */
export default function HeroKeywords({ start }: Readonly<HeroKeywordsProps>) {
    const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

    useEffect(() => {
        if (!start) return;

        const timers = HIGHLIGHT_STEPS.map(({ at, idx }) =>
            setTimeout(() => setHighlightIdx(idx), at)
        );
        return () => timers.forEach(clearTimeout);
    }, [start]);

    return (
        <motion.p
            className="text-lg leading-relaxed"
            variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: "easeOut" },
                },
            }}
        >
            Designing and building scalable web applications with a strong focus on{" "}
            {KEYWORDS.map((kw, i) => (
                <span key={kw}>
                    {/*
                      Literal colours, not var(--color-*): framer-motion
                      interpolates these and it cannot tween a var(). They are
                      still the palette's own values, so keep them in step with
                      globals.css by hand — #f8f6f2 is --color-paper and #666666
                      is --color-grey-40, the muted body colour Experience uses
                      on the same paper ground.
                    */}
                    <motion.span
                        className="font-mono tracking-wide px-1 py-0.5"
                        animate={
                            highlightIdx === i
                                ? {
                                      backgroundColor: "rgba(0,0,0,0.88)",
                                      color: "#f8f6f2",
                                  }
                                : {
                                      backgroundColor: "rgba(0,0,0,0.05)",
                                      color: "#666666",
                                  }
                        }
                        transition={
                            highlightIdx === i
                                ? { duration: 0.12 }
                                : { duration: 0.55, ease: "easeOut" }
                        }
                    >
                        {kw}
                    </motion.span>
                    {i === 0 ? ", " : i === 1 ? ", and " : ""}
                </span>
            ))}
        </motion.p>
    );
}
