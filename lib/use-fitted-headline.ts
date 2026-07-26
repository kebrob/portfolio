"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";

interface FittedHeadline {
    /**
     * Attach to a hidden element whose content and typography match the
     * headline. The fit is measured there so the real heading can stay purely
     * React-rendered.
     */
    measureRef: RefObject<HTMLDivElement | null>;
    /** Fitted size, e.g. `"154.652px"`. Null until the first measurement lands. */
    fontSize: string | null;
    /** Rendered width at `fontSize`, in px. Null until the first measurement lands. */
    width: number | null;
}

/** Long enough for the webfont to settle, so the first fit measures real metrics. */
const MEASURE_DELAY_MS = 100;

/**
 * Finds the largest font size at which a single line of text still fits the
 * viewport, by binary search over a hidden element the caller renders.
 *
 * Measuring off to the side rather than on the heading itself is the point:
 * writing `textContent`/`style` onto a node React also renders children into
 * leaves the two fighting over it, and any `innerHTML` restore replaces nodes
 * React's fiber tree still holds references to.
 */
export function useFittedHeadline({ settled }: { settled: boolean }): FittedHeadline {
    const measureRef = useRef<HTMLDivElement>(null);
    const [metrics, setMetrics] = useState<{ fontSize: string; width: number } | null>(null);

    // Read through refs so the effect can keep empty deps. It owns a timeout and
    // a resize listener; re-subscribing whenever `settled` flips would tear both
    // down and rebuild them in the middle of the reveal.
    const settledRef = useRef(settled);
    const hasMeasuredRef = useRef(false);

    const fit = useCallback(() => {
        const element = measureRef.current;
        if (!element) return;

        // Between the first fit and the end of the reveal the heading is
        // mid-animation. Refitting there would resize the text under it.
        if (hasMeasuredRef.current && !settledRef.current) return;

        let minSize = 10;
        let maxSize = 2000;
        let bestSize = minSize;

        while (maxSize - minSize > 0.5) {
            const midSize = (minSize + maxSize) / 2;
            element.style.fontSize = `${midSize}px`;

            if (element.scrollWidth < window.innerWidth) {
                bestSize = midSize;
                minSize = midSize;
            } else {
                maxSize = midSize;
            }
        }

        // Small buffer for character width variance.
        const fontSize = `${bestSize * 0.96}px`;
        element.style.fontSize = fontSize;
        const width = element.scrollWidth;

        hasMeasuredRef.current = true;
        setMetrics((prev) =>
            prev?.fontSize === fontSize && prev.width === width ? prev : { fontSize, width }
        );
    }, []);

    useEffect(() => {
        const timeout = setTimeout(fit, MEASURE_DELAY_MS);
        window.addEventListener("resize", fit);

        return () => {
            clearTimeout(timeout);
            window.removeEventListener("resize", fit);
        };
    }, [fit]);

    useEffect(() => {
        settledRef.current = settled;
        if (!settled) return;

        // Resizes are dropped while the reveal runs, so the fit can be stale by
        // the time it ends. Catch up once, on the same delay as the first fit.
        const timeout = setTimeout(fit, MEASURE_DELAY_MS);
        return () => clearTimeout(timeout);
    }, [settled, fit]);

    return {
        measureRef,
        fontSize: metrics?.fontSize ?? null,
        width: metrics?.width ?? null,
    };
}
