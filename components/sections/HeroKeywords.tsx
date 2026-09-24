"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { GREY_40, PAPER } from "@/lib/palette";

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
 * The keywords are <k0>…</k0>, <k1>…</k1>, <k2>…</k2> in the message, so a
 * translation can reorder them freely; the index is what the highlight
 * sequence follows.
 */
export default function HeroKeywords({ start }: Readonly<HeroKeywordsProps>) {
    const t = useTranslations("hero");
    const [highlightIdx, setHighlightIdx] = useState<number | null>(null);

    useEffect(() => {
        if (!start) return;

        const timers = HIGHLIGHT_STEPS.map(({ at, idx }) =>
            setTimeout(() => setHighlightIdx(idx), at)
        );
        return () => timers.forEach(clearTimeout);
    }, [start]);

    const keyword = (i: number) =>
        function Keyword(chunks: ReactNode) {
            return (
                /*
                  Literal colours, not var(--color-*): framer-motion
                  interpolates these and it cannot tween a var(). See
                  lib/palette.ts — GREY_40 is the muted body colour Experience
                  uses on the same paper ground.
                */
                <motion.span
                    className="font-mono tracking-wide px-1 py-0.5"
                    animate={
                        highlightIdx === i
                            ? { backgroundColor: "rgba(0,0,0,0.88)", color: PAPER }
                            : { backgroundColor: "rgba(0,0,0,0.05)", color: GREY_40 }
                    }
                    transition={
                        highlightIdx === i
                            ? { duration: 0.12 }
                            : { duration: 0.55, ease: "easeOut" }
                    }
                >
                    {chunks}
                </motion.span>
            );
        };

    return (
        <p className="hero-rise hero-rise-2 text-lg leading-relaxed">
            {t.rich("statement", { k0: keyword(0), k1: keyword(1), k2: keyword(2) })}
        </p>
    );
}
