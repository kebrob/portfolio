"use client";

import { useEffect, useRef, useState } from "react";
import TypingAnimation from "@/components/ui/TypingAnimation";
import TextWave from "@/components/ui/TextWave";

export default function Hero() {
    const h1Ref = useRef<HTMLHeadingElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [fontSize, setFontSize] = useState("10px");

    useEffect(() => {
        const resizeText = () => {
            const element = h1Ref.current;
            if (!element) return;

            // Don't modify DOM if typing animation is in progress
            if (isReady && !hasAnimated) {
                return;
            }

            // Store current content
            const currentContent = element.innerHTML;

            // Temporarily set full text to measure
            element.textContent = "Robert Kebinger";

            // Create temporary span for cube to measure total width
            const tempSpan = document.createElement("span");
            tempSpan.className =
                "inline-block w-[0.15em] h-[0.15em] mx-1 align-middle bg-[hsl(0_0%_8%)]";
            element.appendChild(tempSpan);

            // Binary search to find the largest font size that fits
            let minSize = 10;
            let maxSize = 2000;
            let bestSize = minSize;

            while (maxSize - minSize > 0.5) {
                const midSize = (minSize + maxSize) / 2;
                element.style.fontSize = `${midSize}px`;

                // Check if text fits within viewport
                if (element.scrollWidth < window.innerWidth) {
                    bestSize = midSize;
                    minSize = midSize;
                } else {
                    maxSize = midSize;
                }
            }

            // Apply the best size that fits
            const finalSize = `${bestSize}px`;
            element.style.fontSize = finalSize;
            setFontSize(finalSize);

            // Clear text before showing typing animation (only if not animated yet)
            if (!hasAnimated) {
                element.textContent = "";
                setIsReady(true);
            } else {
                // Restore content if animation already completed
                element.innerHTML = currentContent;
            }
        };

        setTimeout(resizeText, 100);
        window.addEventListener("resize", resizeText);
        return () => window.removeEventListener("resize", resizeText);
    }, [hasAnimated, isReady]);

    const handleTypingComplete = () => {
        setHasAnimated(true);
    };

    const scrollToAbout = () => {
        const element = document.getElementById("about");
        element?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section className="min-h-screen flex flex-col relative">
            <div className="flex-1 flex items-center pb-32 md:pb-40 lg:pb-48">
                <div className="w-full flex items-center justify-between px-[20px] md:px-[40px] lg:px-[80px]">
                    {/* Statement block */}
                    <div className="max-w-[520px] space-y-6">
                        <p className="text-xl font-semibold mb-1">
                            Frontend-focused Full-Stack Developer
                        </p>
                        <p className="text-lg leading-relaxed mb-2">
                            Designing and building scalable web applications with a strong focus on
                            frontend architecture, performance, and detail.
                        </p>
                        <p className="font-mono text-sm uppercase tracking-widest text-[hsl(0_0%_40%)] mb-0">
                            Based in Rosenheim, Germany
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-16 left-0 right-0">
                <h1
                    ref={h1Ref}
                    className="font-bold leading-[0.9] tracking-tight whitespace-nowrap inline-block"
                    style={{ opacity: isReady || hasAnimated ? 1 : 0, fontSize }}
                >
                    {hasAnimated && (
                        <>
                            <span>Robert Kebinger</span>
                            <span className="inline-block w-[0.15em] h-[0.15em] mx-1 align-middle bg-[hsl(0_0%_8%)]" />
                        </>
                    )}
                    {!hasAnimated && isReady && (
                        <TypingAnimation
                            text="Robert Kebinger"
                            speed={80}
                            onComplete={handleTypingComplete}
                        />
                    )}
                </h1>
            </div>

            <button
                onClick={scrollToAbout}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase  text-[hsl(0_0%_40%)] opacity-70 hover:opacity-100 transition-colors hoverable cursor-pointer"
            >
                [&nbsp;
                <TextWave
                    text="scroll to explore"
                    invertBox={{
                        backgroundColor: "#000",
                        textColor: "#fff",
                    }}
                    speed={40}
                />
                &nbsp;]
            </button>
        </section>
    );
}
