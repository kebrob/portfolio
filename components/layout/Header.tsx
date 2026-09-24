"use client";

import { useEffect, useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useLenis } from "lenis/react";
import ScrambleText from "@/components/ui/ScrambleText";
import { Link, usePathname } from "@/i18n/navigation";
import { useHeaderTheme } from "@/lib/header-theme";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { INK, PAPER } from "@/lib/palette";
import { HOME_TIME_ZONE, WORDMARK } from "@/lib/site";

// `background`/`textColor` are raw CSS values, not var(--color-*) references,
// because ScrambleText writes them straight onto element.style — see
// lib/palette.ts.
const COLORS = {
    light: {
        textInverted: "text-paper",
        text: "text-ink",
        background: PAPER,
        textColor: INK,
        backgroundInverted: "bg-ink",
    },
    dark: {
        textInverted: "text-ink",
        text: "text-paper",
        background: INK,
        textColor: PAPER,
        backgroundInverted: "bg-paper",
    },
};

const NAV_ITEMS = ["about", "projects", "contact"] as const;

export default function Header() {
    const t = useTranslations("header");
    const locale = useLocale();
    const lenis = useLenis();
    // Locale-less, so this is true on / and on /de alike.
    const pathname = usePathname();
    const onHome = pathname === "/";
    const reducedMotion = usePrefersReducedMotion();
    const { forceDark } = useHeaderTheme();
    const [intersectionDark, setIntersectionDark] = useState(false);
    const isDark = forceDark || intersectionDark;
    const [time, setTime] = useState<string | null>(null);
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    /*
     * The clock next to ROSENHEIM_DE is Rosenheim's time, whatever the
     * visitor's own zone. Formatted by Intl, so a German or Korean visitor gets
     * their own convention (24h, 오전/오후) for free; the underscores are the
     * wordmark's styling, not part of the format.
     *
     * Client-only: the page is prerendered at build, so any time rendered on
     * the server would be the build's, and wrong.
     */
    useEffect(() => {
        const formatter = new Intl.DateTimeFormat(locale, {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: HOME_TIME_ZONE,
        });
        const updateTime = () => {
            setTime(formatter.format(new Date()).replace(/\s+/g, "_").toUpperCase());
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
    }, [locale]);

    const checkIntersection = useCallback(() => {
        const darkSections = document.querySelectorAll(".dark-section");
        let shouldBeDark = false;
        darkSections.forEach((section) => {
            const rect = section.getBoundingClientRect();
            if (rect.top < 40 && rect.bottom > 0) {
                shouldBeDark = true;
            }
        });
        setIntersectionDark(shouldBeDark);
    }, []);

    // Keyed on the pathname. This nav lives in the layout and does not remount
    // across a client-side navigation, so without that dependency the observer
    // would stay bound to the *previous* route's detached sections.
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

        // A scroll listener as well, for updates between observer thresholds.
        // Coalesced to one measurement per frame: scroll events can fire
        // several times a frame, and each check reads every dark section's
        // layout box.
        let frame = 0;
        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                checkIntersection();
            });
        };
        window.addEventListener("scroll", onScroll, { passive: true });

        // No explicit initial check: observe() queues a callback for every
        // target, intersecting or not, so the first run happens on its own — off
        // the effect body, clear of react-hooks/set-state-in-effect. Pages dark
        // from their very top rely on that first run.

        return () => {
            observer.disconnect();
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", onScroll);
        };
    }, [checkIntersection, pathname]);

    /*
     * The nav items are real links to /#about and friends, so they work
     * without JavaScript, open in a new tab, and are visible to crawlers. Off
     * the home page the link simply navigates and the home page finishes the
     * job on arrival — see HashScroll, which has to do the scrolling itself
     * because Lenis has taken over the scroller and the browser's own hash jump
     * cannot reach it. On the home page the click is taken over here instead.
     */
    const scrollToSection = (e: React.MouseEvent, id: string) => {
        if (!onHome || !lenis) return;
        // Leave modified clicks (new tab, new window) to the browser.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();

        const target = document.getElementById(id);
        if (!target) return;

        // Distance sets the duration: the trip to #contact is ~7x the hop to
        // #about, and a fixed duration made Experience's sticky stretch fly past.
        // sqrt, not linear, so far targets are faster per pixel but not
        // proportionally so; clamped at both ends.
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const to = Math.min(target.getBoundingClientRect().top + window.scrollY, maxScroll);
        const distance = Math.abs(to - lenis.scroll);
        const duration = Math.min(2.2, Math.max(0.9, 0.028 * Math.sqrt(distance)));

        lenis.scrollTo(target, {
            // Reduced motion: arrive, don't travel.
            immediate: reducedMotion,
            duration,
            // In-out, not expo-out: an out-curve lurches ~600px on the first frame,
            // which reads as the sticky section breaking. Cubic rather than a
            // steeper power, because a power-n in-out peaks at n x the average
            // velocity and the peak is what whips Experience past.
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
            aria-label={t("navLabel")}
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
                 * The wordmark is the way home from anywhere, which is why neither
                 * archive page carries a second "back home" of its own. Hidden
                 * below md, where it crowded the bar; every nav item still links
                 * to a section of /.
                 */}
                <Link
                    href="/"
                    aria-label={t("homeLabel")}
                    onClick={(e) => {
                        if (!onHome || !lenis) return;
                        // Already home: scroll rather than re-navigate, or Lenis
                        // and the router both try to move the page at once.
                        e.preventDefault();
                        lenis.scrollTo(0, { duration: 1.2, immediate: reducedMotion });
                    }}
                    className="hoverable max-md:hidden font-mono text-mini md:text-[13px] uppercase tracking-widest leading-[1] opacity-60 hover:opacity-100 transition-opacity duration-300"
                >
                    {WORDMARK}
                    <span className="hidden md:inline">
                        _{time ?? "--:--"}_{t("location")}
                    </span>
                </Link>

                <ul className="ms-auto flex flex-wrap justify-end gap-x-4 gap-y-2 list-none">
                    {NAV_ITEMS.map((item) => {
                        const isHovered = hoveredItem === item;
                        const isContact = item === "contact";
                        const label = t(`nav.${item}`);

                        return (
                            <li key={item} className="leading-[1]">
                                <Link
                                    href={{ pathname: "/", hash: item }}
                                    onClick={(e) => scrollToSection(e, item)}
                                    onMouseEnter={() => setHoveredItem(item)}
                                    onMouseLeave={() => setHoveredItem(null)}
                                    className="font-mono text-[13px] uppercase tracking-widest hoverable cursor-pointer leading-[1] block"
                                >
                                    <span className={getContactButtonClasses(isContact)}>
                                        {isHovered ? (
                                            <ScrambleText
                                                key={`${item}-${hoveredItem}`}
                                                text={label}
                                                loop={false}
                                                speed={50}
                                                invertBox={getInvertBoxColors(isContact)}
                                            />
                                        ) : (
                                            label
                                        )}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
