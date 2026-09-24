"use client";

import { useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { displayChar, highlightChar, mapRange, restoreChar, type InvertBox } from "./scramble";

interface TypeTextProps {
    text: string;
    /** 0 = slowest (150ms per character), 100 = fastest (30ms). */
    speed?: number;
    invertBox: InvertBox;
    onComplete?: () => void;
    /** Hold off until the text is fully in view. */
    startOnView?: boolean;
    /**
     * Hide the reveal from assistive tech. The animation renders one span per
     * character, which screen readers announce letter by letter, so a caller
     * that exposes the string some other way should set this.
     */
    "aria-hidden"?: boolean;
}

/**
 * Typewriter reveal: every character starts hidden, then appears one at a time.
 * The character being revealed shows as a random symbol in an inverted box
 * before settling into the real one.
 *
 * Characters are mutated directly through refs rather than through state, which
 * is what keeps a per-character animation off React's render path.
 */
export default function TypeText({
    text,
    speed = 50,
    invertBox,
    onComplete,
    startOnView = false,
    "aria-hidden": ariaHidden,
}: Readonly<TypeTextProps>) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const isInView = useInView(containerRef, { once: true, amount: 1 });
    const shouldAnimate = startOnView ? isInView : true;

    const chars = text.split("");

    useEffect(() => {
        if (!shouldAnimate) return;

        let timeoutId: ReturnType<typeof setTimeout>;
        let isAnimating = true;

        const charCount = chars.length;
        const charDuration = mapRange(speed, 0, 100, 150, 30);
        let currentIdx = 0;

        const typeNextChar = () => {
            if (!isAnimating) return;

            // Settle the character revealed on the previous tick.
            if (currentIdx > 0) {
                const prevChar = charsRef.current[currentIdx - 1];
                if (prevChar) restoreChar(prevChar, chars[currentIdx - 1]);
            }

            if (currentIdx >= charCount) {
                onComplete?.();
                return;
            }

            const currentChar = charsRef.current[currentIdx];
            if (currentChar) {
                currentChar.style.opacity = "1";
                highlightChar(currentChar, invertBox);
            }

            currentIdx++;
            timeoutId = setTimeout(typeNextChar, charDuration);
        };

        // Hide everything up front, then reveal one character at a time.
        charsRef.current.forEach((charEl) => {
            if (charEl) charEl.style.opacity = "0";
        });

        typeNextChar();

        return () => {
            isAnimating = false;
            clearTimeout(timeoutId);
        };
        // Deliberately keyed only on shouldAnimate. The animation is driven
        // imperatively; re-running on prop identity would restart it mid-reveal,
        // since callers pass a fresh `invertBox` object literal on every render.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shouldAnimate]);

    return (
        <span ref={containerRef} aria-hidden={ariaHidden}>
            {chars.map((char, i) => (
                <span
                    key={i}
                    ref={(el) => {
                        charsRef.current[i] = el;
                    }}
                    style={{ opacity: 0 }}
                >
                    {displayChar(char)}
                </span>
            ))}
        </span>
    );
}
