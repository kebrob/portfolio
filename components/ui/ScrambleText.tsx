"use client";

import { useEffect, useRef } from "react";
import { animate, type AnimationPlaybackControls } from "framer-motion";
import { displayChar, highlightChar, mapRange, restoreChar, type InvertBox } from "./scramble";

interface ScrambleTextProps {
    text: string;
    className?: string;
    /** Restart the sweep `delay` seconds after it finishes. */
    loop?: boolean;
    /** 0 = slowest, 100 = fastest. */
    speed?: number;
    /** Seconds before the first sweep, and between loops. */
    delay?: number;
    invertBox: InvertBox;
}

/**
 * Sweeps an inverted highlight box left to right across already-visible text,
 * briefly replacing each character it passes with a random symbol.
 *
 * Characters are mutated directly through refs rather than through state, which
 * is what keeps a per-character animation off React's render path.
 */
export default function ScrambleText({
    text,
    className = "",
    loop = true,
    speed = 50,
    delay = 0,
    invertBox,
}: Readonly<ScrambleTextProps>) {
    const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const currentIndexRef = useRef(0);

    const chars = text.split("");

    useEffect(() => {
        let animation: AnimationPlaybackControls | undefined;
        let timeoutId: ReturnType<typeof setTimeout>;
        let isAnimating = true;

        const charCount = chars.length;

        const runSweep = () => {
            // Higher speed = shorter per-character duration (0.3s down to 0.01s).
            const duration =
                Math.exp(mapRange(speed, 0, 100, Math.log(0.3), Math.log(0.01))) * charCount;

            animation = animate(0, charCount - 1, {
                ease: "linear",
                duration,
                onUpdate: (value) => {
                    if (!isAnimating) return;

                    const newIndex = Math.round(value);
                    if (newIndex === currentIndexRef.current) return;

                    const prevChar = charsRef.current[currentIndexRef.current];
                    if (prevChar) restoreChar(prevChar, chars[currentIndexRef.current]);

                    const currentChar = charsRef.current[newIndex];
                    if (currentChar) highlightChar(currentChar, invertBox);

                    currentIndexRef.current = newIndex;
                },
                onComplete: () => {
                    if (!isAnimating) return;

                    const lastChar = charsRef.current[currentIndexRef.current];
                    if (lastChar) restoreChar(lastChar, chars[currentIndexRef.current]);

                    if (loop) {
                        timeoutId = setTimeout(() => {
                            if (isAnimating) runSweep();
                        }, delay * 1000);
                    }
                },
            });
        };

        if (delay > 0) {
            timeoutId = setTimeout(() => {
                if (isAnimating) runSweep();
            }, delay * 1000);
        } else {
            runSweep();
        }

        return () => {
            isAnimating = false;
            animation?.stop();
            clearTimeout(timeoutId);
        };
        // Deliberately runs once per mount. The animation is driven imperatively,
        // and callers restart it by changing `key`; re-running on prop identity
        // would restart the sweep mid-flight, since callers pass a fresh
        // `invertBox` object literal on every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <span className={className}>
            {chars.map((char, i) => (
                <span
                    key={i}
                    ref={(el) => {
                        charsRef.current[i] = el;
                    }}
                    style={{ opacity: 1 }}
                >
                    {displayChar(char)}
                </span>
            ))}
        </span>
    );
}
