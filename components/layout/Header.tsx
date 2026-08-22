"use client";

import { useEffect, useState, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useLenis } from "lenis/react";
import ScrambleText from "@/components/ui/ScrambleText";
import { useHeaderTheme } from "@/lib/header-theme";

// `background`/`textColor` are raw CSS values, not var(--color-*) references,
// because ScrambleText writes them straight onto element.style — and a var()
// that fails to resolve there yields no colour at all, silently. They mirror
// --color-paper (#f8f6f2) and --color-ink (#141414) in globals.css.
const COLORS = {
    light: {
        textInverted: "text-paper",
        text: "text-ink",
        background: "#f8f6f2",
        textColor: "#141414",
        backgroundInverted: "bg-ink",
    },
    dark: {
        textInverted: "text-ink",
        text: "text-paper",
        background: "#141414",
        textColor: "#f8f6f2",
        backgroundInverted: "bg-paper",
    },
};

export default function Header() {
    const lenis = useLenis();
    const pathname = usePathname();
    const router = useRouter();
    const onHome = pathname === "/";
    const { forceDark } = useHeaderTheme();
    const [intersectionDark, setIntersectionDark] = useState(false);
    const isDark = forceDark || intersectionDark;
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

        const now = new Date();
        const msUntilNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
        let interval: ReturnType<typeof setInterval>;

        const timeout = setTimeout(() => {
            updateTime();
            interval = setInterval(updateTime, 60000);
        }, msUntilNextMinute);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
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
        setIntersectionDark(shouldBeDark);
    }, []);

    // Keyed on the pathname. This nav lives in the layout and does not remount
    // across a client-side navigation, so without that dependency the observer
    // would stay bound to the *previous* route's sections — detached nodes whose
    // rects are all zero — and never see the new page's. The verdict from the
    // old route would then just sit there: /projects is dark from its first
    // pixel, so returning home left the nav dark on paper and its items
    // invisible.
    useEffect(() => {
        const darkSections = document.querySelectorAll(".dark-section");

        // A route with no dark sections at all cannot be resolved by the
        // observer, because there is nothing to observe and therefore no
        // callback. Re-measure by hand instead. Off the effect body via rAF, so
        // this stays clear of react-hooks/set-state-in-effect.
        if (darkSections.length === 0) {
            const id = requestAnimationFrame(checkIntersection);
            return () => cancelAnimationFrame(id);
        }

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

        // No explicit initial check here: observe() queues a callback for every
        // target it is handed, intersecting or not, so the first run happens on
        // its own — off the effect body, which is what keeps this clear of
        // react-hooks/set-state-in-effect. The pages that are dark from their
        // very top (/projects, /project/[slug]) rely on that first run to open
        // with a light nav, so it is load-bearing, just not called by hand. It
        // is also what re-resolves the theme after a route change, since the
        // effect re-runs and observes the new page's sections from scratch.

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", checkIntersection);
        };
    }, [checkIntersection, pathname]);

    const scrollToSection = (id: string) => {
        /*
         * Off the home page these buttons used to do nothing at all: every
         * section they name lives on /, so getElementById found nothing and the
         * click was swallowed. Hand it to the router as a hash instead and let
         * the home page finish the job on arrival — see HashScroll, which has to
         * do the scrolling itself because Lenis has taken over the scroller and
         * the browser's own hash jump cannot reach it.
         */
        if (!onHome) {
            router.push(`/#${id}`);
            return;
        }

        const target = document.getElementById(id);
        if (!lenis || !target) return;

        // The trip to #contact is ~8000px and more than half of it is Experience's
        // sticky panel, which translates nothing while it scrubs. A fixed duration
        // made that stretch fly past at ~9x the speed of the (900px) hop to #about,
        // so the distance sets the time here. sqrt, not linear: the far targets
        // should be faster per pixel, just not nine times faster. Clamped so short
        // hops stay snappy and long ones stop short of feeling like a cutscene.
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const to = Math.min(target.getBoundingClientRect().top + window.scrollY, maxScroll);
        const distance = Math.abs(to - lenis.scroll);
        const duration = Math.min(2.2, Math.max(0.9, 0.028 * Math.sqrt(distance)));

        lenis.scrollTo(target, {
            duration,
            // Was expo-out, which starts at full speed: the first frame moved ~615px
            // and the first 100ms covered over half the page, then the last couple
            // hundred pixels crawled for the better part of a second. That lurch read
            // as the sticky section breaking. An in-out curve accelerates and settles
            // instead, so the fast part sits in the middle where it belongs.
            //
            // Cubic and not a steeper power: for a power-n in-out the peak velocity is
            // exactly n x the average, and peak is what whips Experience past. Quint
            // was tried and peaks at 316px/frame, plus it has only crept 93px 500ms
            // after the click, which feels like the button missed. Cubic peaks at
            // ~185px/frame and is already 500px along by then.
            easing: (t) => (t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2),
        });
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
                textColor: isDark ? COLORS.dark.textColor : COLORS.light.textColor,
            };
        }

        return {
            backgroundColor: isDark ? COLORS.light.background : COLORS.dark.background,
            textColor: isDark ? COLORS.light.textColor : COLORS.dark.textColor,
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
                {/*
                 * The wordmark is the way home from anywhere — the one thing a
                 * visitor already expects a top-left mark to do, which is why
                 * neither archive page carries a second "back home" of its own.
                 *
                 * It stays visible below md, unlike before, because that is
                 * exactly where it is load-bearing: the detail page's only other
                 * exit goes to the archive. The clock and the location drop off
                 * there instead — they are flavour, the name is the link.
                 */}
                <Link
                    href="/"
                    onClick={(e) => {
                        if (!onHome || !lenis) return;
                        // Already home: scroll rather than re-navigate, or Lenis
                        // and the router both try to move the page at once.
                        e.preventDefault();
                        lenis.scrollTo(0, { duration: 1.2 });
                    }}
                    className="hoverable font-mono text-[11px] md:text-[13px] uppercase tracking-widest leading-[1] opacity-50 hover:opacity-100 transition-opacity duration-300"
                >
                    ROBERTKEBINGER
                    <span className="hidden md:inline">_{time}_ROSENHEIM_DE</span>
                </Link>

                <ul className="flex gap-4 list-none">
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
                                            <ScrambleText
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
