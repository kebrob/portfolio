"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/*
 * Lands /#about, /#projects and /#contact on the right section.
 *
 * Nothing does this for free here. The browser's own hash jump happens before
 * the page has laid out at full height, Next's scroll handling has the same
 * problem, and Lenis owns the scroll position afterwards and would not have
 * heard about either. So the arrival is done by hand, through Lenis.
 *
 * Immediate, not animated. The trip to #contact is ~8000px through Experience's
 * sticky panel; played as a scroll it is a five-figure-pixel cutscene past every
 * section the visitor just chose to skip. They asked to be somewhere, so put
 * them there — the nav's in-page clicks still animate, because there the travel
 * is the feedback that the click worked.
 *
 * THE HASH IS SPENT ON ARRIVAL. Once the scroll has landed the fragment is
 * dropped from the URL with replaceState, so a reload opens at the top like any
 * other load of "/".
 *
 * The reason is that the same nav button already behaves that way on the home
 * page: there it calls lenis.scrollTo and never touches the URL. Leaving the
 * hash behind on the cross-page path would mean one button with two different
 * URL behaviours depending on where it was pressed, and the difference would
 * only ever show up as a surprise — a later reload skipping the sequence the
 * home page is built around. So the hash is used as what it actually is here:
 * how the nav tells the home page where to open, not an address of a section.
 *
 * replaceState rather than pushState, so this does not put a second entry in
 * the history and turn Back into a no-op that stays on the page.
 *
 * WHY IT KEEPS CORRECTING. One scroll on mount lands in the wrong place: the
 * Hero sizes its headline by binary search against the real font, so the page
 * grows under the target after the first frame, and #about ends up a few
 * hundred pixels below where it was when we jumped. Measured once: asked for
 * #about, landed 517px short of it. So the target is re-measured every frame
 * until it stops moving, which also absorbs any scroll Next performs on its own
 * way in.
 */

/** Frames of stillness before the arrival is considered settled. */
const STABLE_FRAMES = 3;
/** Hard stop, in case something on the page never stops resizing. */
const MAX_FRAMES = 90;

export default function HashScroll() {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        const id = window.location.hash.slice(1);
        if (!id) return;
        if (!document.getElementById(id)) return;

        let frames = 0;
        let stable = 0;
        let raf = 0;
        let cancelled = false;

        // Spend the hash. Also runs on abort: a visitor who scrolled away is the
        // clearest case of the fragment no longer describing where they are.
        const clearHash = () => {
            history.replaceState(null, "", window.location.pathname + window.location.search);
        };

        // Any real input means the visitor has taken over, and correcting under
        // them would read as the page fighting the wheel.
        const abort = () => {
            cancelled = true;
            clearHash();
        };

        const step = () => {
            if (cancelled) return;

            const target = document.getElementById(id);
            if (!target) return;

            const to = target.getBoundingClientRect().top + window.scrollY;
            if (Math.abs(to - window.scrollY) > 2) {
                lenis.scrollTo(to, { immediate: true });
                stable = 0;
            } else {
                stable++;
            }

            if (stable < STABLE_FRAMES && ++frames < MAX_FRAMES) {
                raf = requestAnimationFrame(step);
            } else {
                clearHash();
            }
        };

        raf = requestAnimationFrame(step);
        window.addEventListener("wheel", abort, { passive: true, once: true });
        window.addEventListener("touchstart", abort, { passive: true, once: true });
        window.addEventListener("keydown", abort, { once: true });

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            window.removeEventListener("wheel", abort);
            window.removeEventListener("touchstart", abort);
            window.removeEventListener("keydown", abort);
        };
        // Once per mount. Re-running on a lenis identity change would yank a
        // visitor who has since scrolled away back to the anchor.
    }, [lenis]);

    return null;
}
