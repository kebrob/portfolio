"use client";

import { usePageTheme } from "@/lib/page-theme";

/*
 * The light/dark switch — a shallow orbit.
 *
 * A sun and a moon on the rim of a wheel whose centre is six rems below the
 * frame. Turning it 44° carries one of them out of the window and brings the
 * other in, and because the radius is so much larger than the frame, the part
 * of that arc you can actually see is nearly flat: the body crosses almost
 * level, dips at the edges, and nothing in the control appears to rotate.
 *
 * No words. The site calls its two colours paper and ink and a visitor does
 * not, so rather than teach the vocabulary in a 10px label the control shows
 * the two things everyone already reads as day and night. The title attribute
 * and the aria-label carry the same meaning for anyone who needs it spelled.
 *
 * WHY IT IS KEYED TO `target` AND NOT `theme`. `theme` is the committed colour,
 * which flips at the midpoint of the flood — a control keyed to it sits still
 * for 575ms after the click and then moves, so the click reads as dropped.
 * `target` is set on the click itself. The page still turns over on its own
 * clock; only the switch answers immediately.
 *
 * Keying to React state does mean this cannot be right before hydration the way
 * a CSS-only control could be: it renders the default on the server and adopts
 * the real value in the provider's layout effect, which runs before the browser
 * paints — see the note in lib/page-theme.tsx. What that correction must not do
 * is animate, and see MOVE below for why it cannot.
 */

/** The wheel's radius. Six rems against a two-rem window is the whole idea. */
const R_REM = 6;
/** Degrees between the two rest positions. */
const TURN = 44;
/**
 * How far below the window's top edge the marks ride, in px.
 *
 * It has to clear the largest mark's radius — 7.5px — with air to spare. At 7px
 * the top of the sun sat half a pixel above the frame and was clipped flat.
 */
const TOP_PX = 11;

/** Sun and moon at a size that holds up next to 12px mono. */
const SUN = 14;
const MOON = 15;

export default function PaperInkToggle() {
    const { target, toggle, transitioning } = usePageTheme();
    const isDark = target === "dark";

    /*
     * Only transition while a flood is actually running.
     *
     * `transitioning` is set in the same commit as `target`, so the click still
     * animates: a transition is decided by the after-change style, and by then
     * the declaration is there. Everything else it excludes is a case where
     * movement would be wrong — the provider's pre-paint correction on load,
     * which must snap or the switch slides across on every reload, and the
     * reduced-motion path, which commits the theme without a flood at all.
     */
    const MOVE = transitioning ? `transform 900ms cubic-bezier(0.4, 0, 0.15, 1)` : "none";

    /*
     * A zero-width arm from the wheel's centre to its rim, with the mark at the
     * far end. The arm sets where on the rim the mark lives; the wheel's own
     * rotation moves it; the mark then takes off everything above it, so it
     * arrives upright rather than having turned 44° on the way.
     */
    const body = (mark: React.ReactNode, angle: number) => (
        <span
            className="absolute top-0 left-1/2 h-1/2 w-0 origin-bottom"
            style={{ transform: `rotate(${angle}deg)` }}
        >
            <span
                className="absolute top-0 left-0 block"
                style={{
                    transform: `translate(-50%, -50%) rotate(${-(angle + (isDark ? TURN : 0))}deg)`,
                    transition: MOVE,
                }}
            >
                {mark}
            </span>
        </span>
    );

    return (
        <button
            type="button"
            onClick={toggle}
            // Not disabled mid-flood — a disabled button drops focus and reads
            // as broken. The handler ignores the click; the cursor says why.
            aria-pressed={isDark}
            aria-label={`Switch to the ${isDark ? "light" : "dark"} theme`}
            title={`Switch to the ${isDark ? "light" : "dark"} theme`}
            className={`hoverable group block text-[var(--page-fg)] ${
                transitioning ? "cursor-wait" : "cursor-pointer"
            }`}
        >
            {/*
             * The horizon is the frame's own bottom edge, and it is the only
             * part that answers the pointer. Colour lives here and on the
             * button, not on the marks: the marks are currentColor, so the
             * theme's own fade carries them and their transforms stay free to
             * be switched off.
             */}
            <span className="relative block h-[1.9rem] w-[3.6rem] overflow-hidden border-b border-[var(--page-rule)] transition-colors duration-300 group-hover:border-[var(--page-fg)]">
                <span
                    className="absolute left-1/2"
                    style={{
                        top: TOP_PX,
                        height: `${R_REM * 2}rem`,
                        width: `${R_REM * 2}rem`,
                        transform: `translateX(-50%) rotate(${isDark ? TURN : 0}deg)`,
                        transition: MOVE,
                    }}
                >
                    {body(
                        <span
                            className="block rounded-full"
                            style={{ height: SUN, width: SUN, backgroundColor: "currentColor" }}
                        />,
                        0
                    )}
                    {body(
                        <svg
                            viewBox="0 0 24 24"
                            width={MOON}
                            height={MOON}
                            aria-hidden
                            className="block"
                        >
                            <path
                                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                                fill="currentColor"
                            />
                        </svg>,
                        -TURN
                    )}
                </span>
            </span>
        </button>
    );
}
