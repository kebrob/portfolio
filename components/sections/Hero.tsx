"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import TextAnimation from "@/components/ui/TextAnimation";

export default function Hero() {
    const lenis = useLenis();
    const h1Ref = useRef<HTMLHeadingElement>(null);
    const [isReady, setIsReady] = useState(false);
    const [hasAnimated, setHasAnimated] = useState(false);
    const [fontSize, setFontSize] = useState("10px");
    const [textWidth, setTextWidth] = useState(0);

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

            // Reset width to auto for accurate measurement
            element.style.width = "auto";

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

            // Apply the best size that fits with a small buffer for character width variance
            const finalSize = `${bestSize * 0.96}px`;
            element.style.fontSize = finalSize;
            setFontSize(finalSize);

            // Capture the full text width for centering
            setTextWidth(element.scrollWidth);

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
        lenis?.scrollTo("#about", {
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            lerp: 0.1,
        });
    };

    return (
        <section className="min-h-screen flex flex-col relative">
            <div className="flex-1 flex items-center pb-32 md:pb-40 lg:pb-48">
                <div className="w-full flex items-center justify-between px-[20px] md:px-[40px] lg:px-[80px]">
                    {/* Statement block */}
                    <div className="max-w-[520px] space-y-4">
                        <p className="text-xl font-semibold">
                            <span className="inline-block bg-[hsl(0_0%_10%)] text-white font-mono px-1 py-0.5">
                                Frontend-focused
                            </span>{" "}
                            Full-Stack Developer
                        </p>

                        <p className="text-lg leading-relaxed text-neutral-900">
                            Designing and building scalable web applications with a strong focus on{" "}
                            <span className="font-mono tracking-wide px-1 py-0.5 bg-black/5 text-neutral-700">
                                architecture
                            </span>
                            ,{" "}
                            <span className="font-mono tracking-wide px-1 py-0.5 bg-black/5 text-neutral-700">
                                performance
                            </span>
                            , and{" "}
                            <span className="font-mono tracking-wide px-1 py-0.5 bg-black/5 text-neutral-700">
                                detail
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-10 left-0 right-0 flex justify-center">
                <h1
                    ref={h1Ref}
                    className="font-bold leading-[1.2] tracking-tighter whitespace-nowrap"
                    style={{
                        opacity: isReady || hasAnimated ? 1 : 0,
                        fontSize,
                        width: textWidth > 0 ? `${textWidth}px` : "auto",
                    }}
                >
                    {hasAnimated && (
                        <>
                            <span>Robert Kebinger</span>
                            <span className="inline-block w-[0.15em] h-[0.15em] mx-1 align-middle bg-[hsl(0_0%_8%)]" />
                        </>
                    )}
                    {!hasAnimated && isReady && (
                        <TextAnimation
                            text="Robert Kebinger"
                            mode="typing"
                            speed={50}
                            invertBox={{ backgroundColor: "#141414", textColor: "#f8f6f2" }}
                            loop={false}
                            startOnView={true}
                            onComplete={handleTypingComplete}
                        />
                    )}
                </h1>
            </div>

            <button
                onClick={scrollToAbout}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs uppercase  text-[hsl(0_0%_40%)] hover:text-[hsl(0_0%_00%)] transition-colors hoverable cursor-pointer"
            >
                <TextAnimation
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
