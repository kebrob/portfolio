/**
 * The viewport height the page is laid out against, in px: --vh as
 * VIEWPORT_SCRIPT pinned it (see globals.css), not window.innerHeight.
 *
 * Anything that does scroll arithmetic against a section sized in --vh has to
 * use this, or the two disagree by the toolbar's height whenever the mobile
 * toolbar is out of step with the value --vh was taken at.
 *
 * Reads the inline style, which costs no style recalc, so it is fine per frame.
 */
export function stableViewportHeight(): number {
    const vh = parseFloat(document.documentElement.style.getPropertyValue("--vh"));
    return vh > 0 ? vh * 100 : window.innerHeight;
}
