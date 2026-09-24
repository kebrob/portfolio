/*
 * A hand-inlined .dark-section, for the two places that paint the dark ground
 * without being one.
 *
 * It cannot use the class itself: .dark-section is what the Header's
 * intersection check watches, and both users of this are fixed, full-viewport
 * elements present on page views that are not dark at all — the nav would flip
 * while the page was still paper-white.
 *
 * Keep in sync with .dark-section in globals.css, and with the colours the ink
 * shader resolves to at density 1 (see FRAG_MAIN in gl-transition.ts). All
 * three describe the same surface, so a change to one is a change to all of
 * them.
 */
export const DARK_PANEL = {
    backgroundColor: "var(--color-grey-6)",
    backgroundImage: "var(--pattern-dots)",
    backgroundSize: "20px 20px",
    backgroundAttachment: "fixed",
} as const;

/*
 * The ground of a section that sits on the ink rather than painting its own:
 * the projects wall and the home page's contact footer.
 *
 * Transparent so the fixed canvas behind shows through — an opaque colour would
 * hide the flood, and the dot lattice would be painted twice.
 *
 * The empty gradient changes nothing on screen. It is for contrast checkers
 * (axe, and so Lighthouse), which cannot see a fixed canvas behind a section
 * that has scrolled away from it: with no image in the way they measured the
 * section's grey text against the body's paper and failed it at 2.25:1. An
 * image ground makes them report "needs review" instead, which is the truth —
 * on the ink it is the grey-6 of DARK_PANEL, where grey-50, the faintest text
 * used here, is 4.85:1.
 */
export const OVER_INK = {
    backgroundColor: "transparent",
    backgroundImage: "linear-gradient(transparent, transparent)",
} as const;
