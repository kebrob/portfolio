"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
    const mq = window.matchMedia(QUERY);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
}

/*
 * Hydration-safe prefers-reduced-motion.
 *
 * framer-motion's useReducedMotion reads the media query during the first client
 * render, which is fine for tweaking a style value but not for choosing which
 * element to render: the server cannot see the query, so it emits one tree and a
 * reduced-motion client emits another, and hydration fails (React error #418).
 *
 * useSyncExternalStore is the supported way out — React renders with
 * getServerSnapshot (false) through hydration, then re-renders with the real
 * value. Unlike a mounted flag it needs no setState in an effect.
 */
export function usePrefersReducedMotion(): boolean {
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(QUERY).matches,
        () => false
    );
}
