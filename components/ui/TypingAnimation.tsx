"use client";

import { useState, useEffect } from "react";

interface TypingAnimationProps {
    text: string;
    speed?: number;
    onComplete?: () => void;
}

export default function TypingAnimation({ text, speed = 80, onComplete }: TypingAnimationProps) {
    const [displayedText, setDisplayedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        setDisplayedText("");
        setIsComplete(false);
        let currentIndex = 0;

        const typingInterval = setInterval(() => {
            if (currentIndex < text.length) {
                setDisplayedText(text.slice(0, currentIndex + 1));
                currentIndex++;
            } else {
                clearInterval(typingInterval);
                setIsComplete(true);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(typingInterval);
    }, [text, speed, onComplete]);

    return (
        <>
            {displayedText}
            {!isComplete && (
                <span
                    className="inline-block w-[0.05em] h-[0.9em] ml-1 bg-[hsl(0_0%_8%)] animate-pulse"
                    style={{ verticalAlign: "baseline" }}
                />
            )}
        </>
    );
}
