"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

interface TextAnimationProps {
    text: string;
    className?: string;
    loop?: boolean;
    speed?: number;
    direction?: "left" | "right";
    delay?: number;
    invertBox?: {
        backgroundColor?: string;
        textColor?: string;
    };
    mode?: "wave" | "typing";
    onComplete?: () => void;
    startOnView?: boolean;
}

export default function TextAnimation({
    text,
    className = "",
    loop = true,
    speed = 50,
    direction = "right",
    delay = 0,
    invertBox,
    mode = "wave",
    onComplete,
    startOnView = false,
}: Readonly<TextAnimationProps>) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const currentIndexRef = useRef(0);
    const [isReady, setIsReady] = useState(false);
    const isInView = useInView(containerRef, {
        once: true,
        amount: 1,
    });
    const shouldAnimate = startOnView ? isInView : true;

    const chars = text.split("");
    const randomChars = ["$", "+", "#", "*", "/", "\\", "&", "%", "?", ";"];

    const getRandomChar = () => randomChars[Math.floor(Math.random() * randomChars.length)];

    useEffect(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) return;
        if (!shouldAnimate) return;

        let animation: any;
        let timeoutId: NodeJS.Timeout;

        const charCount = chars.length;

        const mapRange = (
            value: number,
            fromLow: number,
            fromHigh: number,
            toLow: number,
            toHigh: number
        ) => {
            if (fromLow === fromHigh) return toLow;
            const percentage = (value - fromLow) / (fromHigh - fromLow);
            return toLow + percentage * (toHigh - toLow);
        };

        const runTypingAnimation = () => {
            let currentIdx = 0;

            const typeNextChar = () => {
                if (currentIdx >= charCount) {
                    // Animation complete
                    const lastChar = charsRef.current[currentIdx - 1];
                    if (lastChar && invertBox) {
                        lastChar.style.backgroundColor = "";
                        lastChar.style.color = "";
                        const originalChar = chars[currentIdx - 1];
                        lastChar.textContent = originalChar === " " ? "\u00A0" : originalChar;
                    }

                    onComplete?.();

                    if (loop) {
                        // Reset all characters to hidden
                        charsRef.current.forEach((charEl, idx) => {
                            if (charEl) {
                                charEl.style.opacity = "0";
                            }
                        });
                        timeoutId = setTimeout(() => {
                            runTypingAnimation();
                        }, delay * 1000);
                    }
                    return;
                }

                // Clear previous character (if any)
                if (currentIdx > 0) {
                    const prevChar = charsRef.current[currentIdx - 1];
                    if (prevChar && invertBox) {
                        prevChar.style.backgroundColor = "";
                        prevChar.style.color = "";
                        const originalChar = chars[currentIdx - 1];
                        prevChar.textContent = originalChar === " " ? "\u00A0" : originalChar;
                    }
                }

                // Show and highlight current character with random char
                const currentChar = charsRef.current[currentIdx];
                if (currentChar && invertBox) {
                    currentChar.style.opacity = "1";
                    currentChar.style.backgroundColor = invertBox.backgroundColor || "#000";
                    currentChar.style.color = invertBox.textColor || "#fff";
                    currentChar.textContent = getRandomChar();
                }

                currentIdx++;

                // Calculate delay based on speed (similar to TypingAnimation)
                const typingSpeed = mapRange(speed, 0, 100, 150, 30);
                timeoutId = setTimeout(typeNextChar, typingSpeed);
            };

            // Initialize all characters as hidden
            charsRef.current.forEach((charEl) => {
                if (charEl) {
                    charEl.style.opacity = "0";
                }
            });

            typeNextChar();
        };

        const runAnimation = () => {
            const start = direction === "right" ? 0 : charCount - 1;
            const end = direction === "right" ? charCount - 1 : 0;
            const duration =
                Math.exp(mapRange(speed, 0, 100, Math.log(0.3), Math.log(0.01))) * charCount;

            animation = animate(start, end, {
                ease: "linear",
                duration,
                onUpdate: (value) => {
                    const newIndex = Math.round(value);
                    if (newIndex !== currentIndexRef.current) {
                        // Remove highlight from previous character and restore original
                        const prevChar = charsRef.current[currentIndexRef.current];
                        if (prevChar && invertBox) {
                            prevChar.style.backgroundColor = "";
                            prevChar.style.color = "";
                            const originalChar = chars[currentIndexRef.current];
                            prevChar.textContent = originalChar === " " ? "\u00A0" : originalChar;
                        }

                        // Add highlight to current character and change to random symbol
                        const currentChar = charsRef.current[newIndex];
                        if (currentChar && invertBox) {
                            currentChar.style.backgroundColor = invertBox.backgroundColor || "#000";
                            currentChar.style.color = invertBox.textColor || "#fff";
                            currentChar.textContent = getRandomChar();
                        }

                        currentIndexRef.current = newIndex;
                    }
                },
                onComplete: () => {
                    // Clear the last character and restore original
                    const lastChar = charsRef.current[currentIndexRef.current];
                    if (lastChar && invertBox) {
                        lastChar.style.backgroundColor = "";
                        lastChar.style.color = "";
                        const originalChar = chars[currentIndexRef.current];
                        lastChar.textContent = originalChar === " " ? "\u00A0" : originalChar;
                    }

                    onComplete?.();

                    if (loop) {
                        timeoutId = setTimeout(runAnimation, delay * 1000);
                    }
                },
            });
        };

        if (mode === "typing") {
            // Initialize all characters as hidden immediately for typing mode
            charsRef.current.forEach((charEl) => {
                if (charEl) {
                    charEl.style.opacity = "0";
                }
            });

            if (delay > 0) {
                timeoutId = setTimeout(runTypingAnimation, delay * 1000);
            } else {
                runTypingAnimation();
            }
        } else {
            if (delay > 0) {
                timeoutId = setTimeout(runAnimation, delay * 1000);
            } else {
                runAnimation();
            }
        }

        return () => {
            animation?.stop();
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [
        isReady,
        chars.length,
        loop,
        speed,
        direction,
        delay,
        invertBox,
        mode,
        onComplete,
        shouldAnimate,
    ]);

    return (
        <span ref={containerRef} className={className}>
            {chars.map((char, i) => (
                <span
                    key={i}
                    ref={(el) => {
                        charsRef.current[i] = el;
                    }}
                    style={{
                        willChange: "background-color, color",
                        opacity: mode === "typing" ? 0 : 1,
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </span>
            ))}
        </span>
    );
}
