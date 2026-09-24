"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import { createGlTransition, type GlTransition } from "@/lib/ink/gl-transition";
import { INK_BLEED_GLSL } from "@/lib/ink/ink-bleed";
import { DARK_PANEL } from "@/lib/ink/dark-panel";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { DEFAULT_THEME, DURATION_MS, usePageTheme } from "@/lib/page-theme";

/*
 * The dark ground on the archive pages, and the animation between grounds.
 *
 * This is the same fixed, -z-10 canvas the home page floods with, so the work
 * scrolls over the top of it and the ink is behind the page rather than over
 * it. The difference is what drives it: there, scroll position; here, a tween
 * fired by the toggle.
 *
 * The canvas IS the dark background — there is no dark CSS underneath it. That
 * is what makes one shader enough for both directions: going light does not
 * paint paper over ink, it drains the ink and lets the body's paper through.
 *
 * Which is also why the first frame has to be synchronous. Opening /projects
 * in the dark theme means opening with the canvas already at 1, and an rAF
 * frame arrives after the browser has painted — one frame of white. Hence the
 * layout effect and initialProgress; see gl-transition.ts.
 *
 * A RELOAD IS NOT A TRANSITION:
 *
 *   - The seed comes from the attribute the inline script wrote, not `target`,
 *     which reports DEFAULT_THEME during hydration to match the server.
 *   - Only a toggle animates; any other change of `target` is bookkeeping
 *     catching up with the DOM and belongs on a jump.
 *
 * And before any of it, there is a frame with no canvas at all, because the
 * context is created after hydration. .theme-ground covers exactly that gap —
 * it is the same surface in CSS, and it is dropped the moment the canvas has
 * painted for real.
 */

function initialProgress() {
    if (typeof document === "undefined") return DEFAULT_THEME === "dark" ? 1 : 0;
    return document.documentElement.dataset.pageTheme === "light" ? 0 : 1;
}

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ThemeInk() {
    const { target, transitioning } = usePageTheme();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<GlTransition | null>(null);
    const [glFailed, setGlFailed] = useState(false);
    const [painted, setPainted] = useState(false);

    const reducedMotion = usePrefersReducedMotion();

    // Seeded from the attribute, not from `target` — see above.
    const progress = useMotionValue(initialProgress());

    useIsomorphicLayoutEffect(() => {
        if (!canvasRef.current) return;

        const gl = createGlTransition(canvasRef.current, INK_BLEED_GLSL, {
            maxDpr: window.innerWidth < 768 ? 1.5 : 2,
            initialProgress: progress.get(),
        });
        if (!gl) {
            setGlFailed(true);
            return;
        }

        glRef.current = gl;
        // createGlTransition drew synchronously above, so by here the canvas
        // genuinely holds the right pixels. Setting state from a layout effect
        // is flushed before paint, so the ground is removed on the same frame
        // the canvas takes over and there is no gap between them.
        setPainted(true);

        const canvas = canvasRef.current;
        const ro = new ResizeObserver(() => gl.resize());
        ro.observe(canvas);

        // A context can also die later — a mobile browser reclaiming a
        // backgrounded tab, a GPU reset. The canvas then goes transparent, and
        // since it IS the dark ground, dark-theme text lands on bare paper.
        // Drop to the CSS panel, which follows the same progress value.
        const onLost = () => {
            glRef.current = null;
            setGlFailed(true);
        };
        canvas.addEventListener("webglcontextlost", onLost);

        return () => {
            canvas.removeEventListener("webglcontextlost", onLost);
            ro.disconnect();
            gl.destroy();
            glRef.current = null;
            setPainted(false);
        };
        // Once per mount. progress is a stable motion value, and re-creating the
        // context on a theme change would throw away the frame the flood is on.
    }, [progress]);

    useEffect(() => {
        const to = target === "dark" ? 1 : 0;
        if (progress.get() === to) return;

        // Only a toggle floods. Anything else moving `target` is state catching
        // up with the DOM, and animating that tells the visitor they did
        // something they did not do.
        if (reducedMotion || !transitioning) {
            progress.jump(to);
            return;
        }

        // ease-in-out, and not the site's usual expo-out: a flood that starts at
        // full speed arrives before the colour flip at the halfway mark, and the
        // text changes on an already-solid ground instead of with it.
        const controls = animate(progress, to, {
            duration: DURATION_MS / 1000,
            ease: [0.65, 0, 0.35, 1],
        });
        return () => controls.stop();
    }, [target, transitioning, progress, reducedMotion]);

    useMotionValueEvent(progress, "change", (v) => {
        glRef.current?.setProgress(v);
    });

    if (glFailed) {
        // The ground stays under the fallback panel: at progress 0 the panel is
        // fully transparent, and paper is exactly what should show through.
        return (
            <>
                <div className="theme-ground" aria-hidden="true" />
                <motion.div
                    className="pointer-events-none fixed inset-0 -z-10"
                    style={{ opacity: progress, ...DARK_PANEL }}
                    aria-hidden="true"
                />
            </>
        );
    }

    return (
        <>
            {/* Server-rendered, so it is on screen at first paint; gone by the
                frame the canvas has drawn. */}
            {!painted && <div className="theme-ground" aria-hidden="true" />}
            <canvas
                ref={canvasRef}
                className="pointer-events-none fixed inset-0 -z-10 h-full w-full"
                aria-hidden="true"
            />
        </>
    );
}
