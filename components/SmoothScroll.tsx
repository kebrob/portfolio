"use client";

import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export default function SmoothScroll() {
    const lenisRef = useRef<LenisRef>(null);
    // Smoothed wheel scrolling is exactly the kind of motion that setting is
    // for, so reduced-motion visitors get the browser's own scrolling. Lenis
    // still runs (the sections read scroll position through it); it just does
    // not ease the wheel. Changing an option recreates the instance, which
    // happens once, right after hydration, and only for those visitors.
    const reducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        function update(data: { timestamp: number }) {
            const time = data.timestamp;
            lenisRef.current?.lenis?.raf(time);
        }

        frame.update(update, true);

        return () => cancelFrame(update);
    }, []);

    /*
     * Drop any glide still in flight when the route changes.
     *
     * Lenis eases the wheel, so for half a second or so after the last notch it
     * is still animating towards its target — and while it is, it ignores
     * native scroll events. A navigation in that window has Next scroll the new
     * page to the top, Lenis keeps writing its own position, and the new page
     * opens where the old one was. stop() + start() is Lenis's public way
     * to reset: both stop the animation and re-read the real scroll position,
     * so Next's jump stands.
     *
     * A layout effect, so it lands in the same commit as the navigation,
     * before Lenis's next frame can write the old position back. It forces no
     * position of its own: back/forward still restore where you were, and
     * HashScroll still lands /#contact.
     */
    const pathname = usePathname();
    useLayoutEffect(() => {
        const lenis = lenisRef.current?.lenis;
        if (!lenis) return;
        lenis.stop();
        lenis.start();
    }, [pathname]);

    return (
        <ReactLenis
            root
            options={{
                autoRaf: false,
                duration: 1,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                lerp: 0.1,
                smoothWheel: !reducedMotion,
            }}
            ref={lenisRef}
        />
    );
}
