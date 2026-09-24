/*
 * The palette tokens from app/globals.css, as literal colour strings for the
 * places that cannot use var(--color-*):
 *
 *   - framer-motion interpolates colours numerically and cannot tween a var();
 *   - ScrambleText/TypeText write onto element.style, where a var() that fails
 *     to resolve yields no colour at all, silently.
 *
 * Keep in step with @theme in globals.css by hand. (Paper is a hair off the
 * exact conversion of hsl(45 30% 96%) — invisible, not worth changing.)
 */
export const PAPER = "#f8f6f2";
export const INK = "#141414";
/** --color-grey-40, the muted body colour on paper. */
export const GREY_40 = "#666666";

/** The site's expo-out curve — also `ease-out-expo` in CSS. */
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];
