"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/*
 * Paper/ink theme for the archive pages (/projects and /project/[slug]).
 *
 * Scope, deliberately: the home page is not themeable. Its dark is the payoff
 * of the scroll — the ink floods in as you reach the work — and a switch that
 * could pre-empt that would be switching off the site's one idea. These two
 * pages are different: you arrive already inked, with no say in it, and they
 * are where you actually read.
 *
 * The transition is the same ink shader the home page floods with, run off a
 * clock instead of the scrollbar (see ThemeInk). Going dark is the flood
 * playing forward; going light is the same flood draining, which is why there
 * is no second shader for the light direction — the paper is not painted, it is
 * uncovered.
 *
 * TWO CLOCKS, ONE TOGGLE. The flood takes DURATION_MS, but the text cannot
 * simply wait for it: colours flip at the halfway point, while the ink is
 * across the middle of the screen and neither colour is badly wrong anywhere.
 * That is what `theme` (committed, drives the CSS) and `target` (where the
 * flood is heading, drives the canvas) are for. They differ only during the
 * swap.
 */

export type PageTheme = "light" | "dark";

/** Ink is the default: it is what these pages have always been. */
export const DEFAULT_THEME: PageTheme = "dark";

export const STORAGE_KEY = "page-theme";

/** Long enough to read as a flood rather than a cut, short enough to re-toggle. */
export const DURATION_MS = 1150;

/*
 * The DOM attribute is the single source of truth, not React state.
 *
 * It has to be: globals.css keys the whole token set off it, and the inline
 * script in app/layout.tsx sets it before first paint so a stored preference
 * does not flash. React state only ever mirrors it, and the mirror is filled in
 * from the attribute in a layout effect — see the provider.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
    listeners.add(onChange);
    return () => {
        listeners.delete(onChange);
    };
}

function readTheme(): PageTheme {
    return document.documentElement.dataset.pageTheme === "light" ? "light" : "dark";
}

function commitTheme(next: PageTheme) {
    document.documentElement.dataset.pageTheme = next;
    try {
        localStorage.setItem(STORAGE_KEY, next);
    } catch {
        // Safari in private mode throws on setItem. The theme still works for
        // this page view; it just will not be remembered.
    }
    listeners.forEach((l) => l());
}

interface PageThemeContextValue {
    /** What the colours currently are. Flips at the midpoint of the swap. */
    theme: PageTheme;
    /** What the flood is heading towards. Equals `theme` when idle. */
    target: PageTheme;
    transitioning: boolean;
    toggle: () => void;
}

const PageThemeContext = createContext<PageThemeContextValue>({
    theme: DEFAULT_THEME,
    target: DEFAULT_THEME,
    transitioning: false,
    toggle: () => {},
});

/*
 * A layout effect runs before the browser paints; a passive one runs after. The
 * difference is the whole reason this is not useEffect — see the provider.
 */
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function PageThemeProvider({ children }: { children: React.ReactNode }) {
    /*
     * Starts at the default so the first render matches the server, then adopts
     * whatever the inline script actually wrote — in a layout effect, so the
     * correction lands before the browser paints and the default is never seen.
     *
     * This was useSyncExternalStore, and it could not do that. The hook is
     * required to return the *server* snapshot during hydration, and the real
     * value only arrives in a re-render afterwards. One paint too late: a
     * visitor who chose paper got a first frame claiming "dark", which ThemeInk
     * faithfully turned into a full flood playing backwards to white on every
     * single reload, and which flipped the nav to its dark colours and then
     * faded them back over 500ms.
     */
    const [theme, setTheme] = useState<PageTheme>(DEFAULT_THEME);
    const [pending, setPending] = useState<PageTheme | null>(null);
    const reducedMotion = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        const sync = () => setTheme(readTheme());
        sync();
        return subscribe(sync);
    }, []);

    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
    useEffect(() => {
        const pins = timers.current;
        return () => {
            pins.forEach(clearTimeout);
            delete document.documentElement.dataset.pageFlooding;
        };
    }, []);

    const toggle = useCallback(() => {
        // Ignore clicks mid-flood. Reversing halfway would need the canvas to
        // animate from wherever it happens to be, and the colour flip already
        // queued would land on the wrong side of it.
        if (pending) return;

        const next: PageTheme = readTheme() === "dark" ? "light" : "dark";

        if (reducedMotion) {
            commitTheme(next);
            return;
        }

        setPending(next);
        // Announced on the element, not just in context, so plain CSS can react
        // to it — the sticky column header stops painting its own ground for the
        // duration. See .page-veil in globals.css.
        document.documentElement.dataset.pageFlooding = "";
        timers.current.push(
            setTimeout(() => commitTheme(next), DURATION_MS / 2),
            // A beat past the end: releasing exactly on DURATION_MS can let the
            // next toggle start on the frame the last one is still settling.
            setTimeout(() => {
                setPending(null);
                delete document.documentElement.dataset.pageFlooding;
            }, DURATION_MS + 80)
        );
    }, [pending, reducedMotion]);

    return (
        <PageThemeContext.Provider
            value={{ theme, target: pending ?? theme, transitioning: pending !== null, toggle }}
        >
            {children}
        </PageThemeContext.Provider>
    );
}

export function usePageTheme() {
    return useContext(PageThemeContext);
}
