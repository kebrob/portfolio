"use client";

import { useEffect, useRef } from "react";
import { useMotionValueEvent } from "framer-motion";
import Projects from "@/components/sections/Projects";
import InkTransition from "@/components/InkTransition";
import { useHeaderTheme } from "@/lib/header-theme";
import { useSectionProgress } from "@/lib/use-section-progress";

/*
 * The paper-to-ink handover into the projects wall.
 *
 * There is no pinned panel. The driver below is a plain spacer that both gives
 * useSectionProgress something to measure and holds the clear run the flood
 * needs. The ink is a fixed backdrop behind the page (see InkTransition), so the
 * wall simply scrolls up through the flood in normal flow.
 *
 * RANGE_VH is how much scrolling the flood takes, and it is deliberately short —
 * 50vh, the reference's exact figure. A long range does not read as a slower
 * flood, it reads as no flood at all: you can park anywhere you like on a
 * half-dark viewport and the whole thing looks like a gradient being panned.
 * (The other half of that fix is in ink-bleed.ts, which concentrates the actual
 * light-to-dark flip into the middle of this range rather than spreading it
 * evenly across it. Shortening the range alone was not enough.)
 *
 * LEAD_VH pulls progress 0 above the end of Experience, so the flood is already
 * under way while Experience is still sliding off the top rather than waiting
 * for a screen of bare paper first. That only works because ink-bleed.ts tilts
 * the fill bottom-first — the ink does not reach the top of the frame until
 * p ~ 0.7, and Experience leaves through the top. What sets 60 is Experience's
 * *content* edge, ~260px short of its sticky panel's bottom: 60 starts the flood
 * into that blank band while the copy above is still leaving. It is not a free
 * parameter — around 77 the ink catches the last line of copy.
 *
 * GAP_VH is clear space between the driver and the wall. What has to land on
 * dark is the wall's first *visible* row — the Featured Work label, ~110px into
 * the section. At 72 the label crosses the bottom edge at p = 0.88, on solid
 * ink; below about p = 0.7 it starts arriving onto grey, which is the thing this
 * whole handover exists to avoid.
 *
 * GAP + LEAD fixes the distance from the end of the flood to the wall, so the
 * two can be traded to slide the whole handover earlier without changing any of
 * its internal spacing.
 *
 * MEASURE_VH is not a tuning knob. useSectionProgress measures from "top hits
 * viewport top" to "bottom hits viewport top", so the driver has to be one
 * viewport taller than the range it wants to report.
 */
const RANGE_VH = 50;
const LEAD_VH = 60;
const GAP_VH = 72;
const MEASURE_VH = 100;

export default function ProjectsTransition() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { setForceDark } = useHeaderTheme();

    const inkProgress = useSectionProgress(containerRef);

    // 0.8 is inside the veil's own late stretch (0.68..1, where the mottle
    // closes into a flat fill), so by here the nav band is dark almost
    // everywhere even where a pale lobe is still open. The reference flips its
    // nav colours across the same span.
    useMotionValueEvent(inkProgress, "change", (v) => setForceDark(v > 0.8));

    // forceDark lives in a provider above <main>, so it outlives this section.
    // Leaving it set on the way out is what made the nav vanish: navigate to
    // /projects from the inked part of the page and the flag stays true, so
    // coming back home lands at scroll 0 on paper with the nav still painting
    // itself paper-on-paper. Every writer of the flag owes this cleanup — the
    // other one is ThemedPage, on the archive pages.
    useEffect(() => () => setForceDark(false), [setForceDark]);

    return (
        <>
            <InkTransition progress={inkProgress} />

            <div
                ref={containerRef}
                aria-hidden="true"
                className="pointer-events-none"
                style={{
                    // Height is fixed by what has to be measured. The top margin
                    // lifts progress 0 above the end of Experience; the bottom
                    // one puts it back so the wall still lands GAP below there,
                    // independent of LEAD.
                    height: `calc(var(--vh) * ${MEASURE_VH + RANGE_VH})`,
                    marginTop: `calc(var(--vh) * ${-LEAD_VH})`,
                    marginBottom: `calc(var(--vh) * ${GAP_VH + LEAD_VH - MEASURE_VH - RANGE_VH})`,
                }}
            />

            <Projects />
        </>
    );
}
