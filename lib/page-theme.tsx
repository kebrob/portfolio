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

export const DEFAULT_THEME: PageTheme = "dark";

const STORAGE_KEY = "page-theme";

export const DURATION_MS = 1150;

/*
 * The DOM attribute is the single source of truth, not React state.
 *
 * It has to be: globals.css keys the whole token set off it, and the inline
 * script in app/[locale]/layout.tsx sets it before first paint so a stored preference
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

/*
 * What the inline script in app/[locale]/layout.tsx does, for the one case
 * where it never ran: a 404. Next serves those as a bare error document that
 * React then renders client-side, so the <head> script is not in the HTML and
 * the attribute is simply missing.
 */
function ensureThemeAttribute() {
    const root = document.documentElement;
    if (root.dataset.pageTheme) return;
    let stored: string | null = null;
    try {
        stored = localStorage.getItem(STORAGE_KEY);
    } catch {
        // Storage refused: fall through to the default, like the script does.
    }
    root.dataset.pageTheme = stored === "light" ? "light" : "dark";
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

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function PageThemeProvider({ children }: { children: React.ReactNode }) {
    /*
     * Starts at the default so the first render matches the server, then adopts
     * whatever the inline script actually wrote — in a layout effect, so the
     * correction lands before the browser paints and the default is never seen.
     *
     * Not useSyncExternalStore: it must return the *server* snapshot during
     * hydration, so the real value arrives one paint too late and ThemeInk
     * would play the flood backwards on every reload.
     */
    const [theme, setTheme] = useState<PageTheme>(DEFAULT_THEME);
    const [pending, setPending] = useState<PageTheme | null>(null);
    const reducedMotion = usePrefersReducedMotion();

    useIsomorphicLayoutEffect(() => {
        const sync = () => setTheme(readTheme());
        ensureThemeAttribute();
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
