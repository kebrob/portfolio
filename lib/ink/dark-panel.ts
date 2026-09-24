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
