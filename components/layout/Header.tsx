"use client";

import { useEffect, useState, useCallback } from "react";
import TextWave from "@/components/ui/TextWave";

const COLORS = {
    light: {
        textInverted: "text-[hsl(45_30%_96%)]",
        text: "text-[hsl(0_0%_8%)]",
        background: "#f8f6f2",
        textHex: "#141414",
        backgroundInverted: "bg-[hsl(0_0%_8%)]",
    },
    dark: {
        textInverted: "text-[hsl(0_0%_8%)]",
        text: "text-[hsl(45_30%_96%)]",
        background: "#141414",
        textHex: "#f8f6f2",
        backgroundInverted: "bg-[hsl(45_30%_96%)]",
    },
};

export default function Header() {
    const [isDark, setIsDark] = useState(false);
    const [time, setTime] = useState("00:00_AM");
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            const minutes = now.getMinutes().toString().padStart(2, "0");
            const ampm = hours >= 12 ? "PM" : "AM";
            hours = hours % 12;
            hours = hours || 12; // 0 should be 12
            const hoursStr = hours.toString().padStart(2, "0");
            setTime(`${hoursStr}:${minutes}_${ampm}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 60000);

        return () => clearInterval(interval);
    }, []);

    const checkIntersection = useCallback(() => {
        const darkSections = document.querySelectorAll(".dark-section");
        let shouldBeDark = false;
        darkSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            // Check if section is intersecting with nav area (top 80px)
            if (rect.top < 40 && rect.bottom > 0) {
                shouldBeDark = true;
            }
        });
        setIsDark(shouldBeDark);
    }, []);

    useEffect(() => {
        const darkSections = document.querySelectorAll(".dark-section");
        if (darkSections.length === 0) return;

        const observer = new IntersectionObserver(
            () => {
                checkIntersection();
            },
            {
                threshold: [0, 0.1, 0.5, 1],
                rootMargin: "0px",
            }
        );

        darkSections.forEach((section) => observer.observe(section));

        // Add scroll listener as well for immediate updates
        window.addEventListener("scroll", checkIntersection, { passive: true });
        checkIntersection(); // Initial check

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", checkIntersection);
        };
    }, [checkIntersection]);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: "smooth" });
    };

    const getContactButtonClasses = (isContact: boolean) => {
        if (!isContact) return "";

        const theme = isDark ? COLORS.dark : COLORS.light;
        return `px-1 py-0.5 ${theme.backgroundInverted} ${theme.textInverted}`;
    };

    const getInvertBoxColors = (isContact: boolean) => {
        if (isContact) {
            return {
                backgroundColor: isDark ? COLORS.dark.background : COLORS.light.background,
                textColor: isDark ? COLORS.dark.textHex : COLORS.light.textHex,
            };
        }

        return {
            backgroundColor: isDark ? COLORS.light.background : COLORS.dark.background,
            textColor: isDark ? COLORS.light.textHex : COLORS.dark.textHex,
        };
    };

    const currentTheme = isDark ? COLORS.dark : COLORS.light;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${currentTheme.text}`}
        >
            <div className="nav-blur">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>

            <div className="flex justify-between items-baseline px-3 py-3 relative z-10">
                <div className="font-mono text-[13px] uppercase tracking-widest opacity-50 leading-[1] hidden md:block">
                    ROBERTKEBINGER_{time}_ROSENHEIM_DE
                </div>

                <ul className="flex gap-4 list-none md:ml-0 ml-auto">
                    {["about", "projects", "contact"].map((item) => {
                        const isHovered = hoveredItem === item;
                        const isContact = item === "contact";

                        return (
                            <li key={item} className="leading-[1]">
                                <button
                                    onClick={() => scrollToSection(item)}
                                    onMouseEnter={() => setHoveredItem(item)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className={`font-mono text-[13px] uppercase tracking-widest transition-opacity duration-300 hoverable cursor-pointer leading-[1] block`}
                                >
                                    <span className={getContactButtonClasses(isContact)}>
                                        {isHovered ? (
                                            <TextWave
                                                key={`${item}-${hoveredItem}`}
                                                text={item}
                                                loop={false}
                                                speed={50}
                                                invertBox={getInvertBoxColors(isContact)}
                                            />
                                        ) : (
                                            item
                                        )}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
