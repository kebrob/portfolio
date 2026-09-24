"use client";

import { useEffect } from "react";
import ThemeInk from "@/components/ThemeInk";
import { useHeaderTheme } from "@/lib/header-theme";
import { usePageTheme } from "@/lib/page-theme";

/*
 * Wrapper for the two themeable pages. Owns the three things they both need and
 * neither should repeat: the ink canvas, the nav's colour, and a transparent
 * shell that lets the canvas through.
 *
 * Transparent is load-bearing: an opaque ground (.dark-section, say) would hide
 * the ink entirely, with the flood happening invisibly behind it.
 *
 * Children stay server components; this only wraps them.
 */
export default function ThemedPage({ children }: { children: React.ReactNode }) {
    const { theme } = usePageTheme();
    const { setForceDark } = useHeaderTheme();

    /*
     * The nav cannot work this one out for itself. Its own check looks for a
     * .dark-section under the nav band, and the dark here is a fixed canvas
     * behind the page — there is no element to find. So the page states it.
     *
     * Following `theme` rather than `target` is what keeps the nav in step with
     * the body text: both flip at the midpoint of the flood.
     */
    useEffect(() => {
        setForceDark(theme === "dark");
        return () => setForceDark(false);
    }, [theme, setForceDark]);

    return (
        <>
            <ThemeInk />
            <div className="themed-page min-h-screen">{children}</div>
        </>
    );
}
