"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useSpring, type MotionValue } from "framer-motion";
import { createGlTransition, type GlTransition } from "@/lib/ink/gl-transition";
import { INK_BLEED_GLSL } from "@/lib/ink/ink-bleed";
import { DARK_PANEL } from "@/lib/ink/dark-panel";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/*
 * Paper-to-ink transition, driven by a scroll progress value rather than a clock
 * so it scrubs both ways with the page.
 *
 * Fixed to the viewport and at -z-10, which puts it above the page background but
 * *behind* every in-flow section. That ordering is the whole point: the projects
 * wall scrolls up over the top of it, so the work is already on screen while the
 * page is still light and the ink floods in around it. Painting the ink over the
 * content instead would mean nothing could be visible until the flood finished,
 * which is what left a screen-height of empty dark space before.
 *
 * The shader is not driven by the scroll value directly but by a follower that
 * chases it. Scrolling is not continuous input — a wheel arrives as ~100px
 * steps, and over a half-viewport range each of those is a fifth of the whole
 * flood. Bound 1:1 the ink teleports a fifth of a screen per notch, which reads
 * as a slideshow of static states; behind a follower the same notch becomes a
 * short eased glide, so what you see is an animation the scroll is aiming
 * rather than a slider it is dragging. The reference site does this with a
 * per-frame lerp of 0.045; a critically-damped spring is the same idea with a
 * shorter tail. It must stay overdamped — any overshoot would flood past the
 * top of the screen and suck back down.
 *
 * The fallback is a plain crossfade to the same colour, used when WebGL2 is
 * unavailable (older Safari, blocklisted GPUs) or the visitor prefers reduced
 * motion. It is deliberately the same target colour and the same progress value,
 * so the section always ends up in exactly the same state either way.
 */

export default function InkTransition({
    progress,
}: {
    /** 0 (paper) to 1 (fully inked). */
    progress: MotionValue<number>;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<GlTransition | null>(null);
    const [glFailed, setGlFailed] = useState(false);

    // Must be the hydration-safe hook, not framer's: this picks the element type,
    // and a server/client disagreement there is a hydration failure rather than a
    // cosmetic one. See lib/use-prefers-reduced-motion.ts.
    const disabled = usePrefersReducedMotion();
    const fallback = disabled || glFailed;

    // damping > 2*sqrt(stiffness) (= 15.5) keeps it overdamped. restDelta is
    // well below framer's default because this is a 0..1 value: at the default
    // 0.01 the flood would settle a percent short and never fully solidify.
    const smoothed = useSpring(progress, {
        stiffness: 60,
        damping: 20,
        mass: 1,
        restDelta: 0.0005,
    });
    // Reduced motion gets the raw value: the point there is less movement, not
    // extra easing on top of it.
    const driver = disabled ? progress : smoothed;

    useEffect(() => {
        if (disabled || !canvasRef.current) return;

        const gl = createGlTransition(canvasRef.current, INK_BLEED_GLSL, {
            // The shader runs four fbm octaves per pixel; half resolution on
            // phones costs far less than it saves.
            maxDpr: window.innerWidth < 768 ? 1.5 : 2,
        });
        if (!gl) {
            setGlFailed(true);
            return;
        }

        glRef.current = gl;
        // Seed from the live value — a reload partway down the page must paint
        // the correct frame immediately, not start from 0. jump() rather than
        // set() so the follower lands there instead of animating a flood the
        // visitor never scrolled.
        smoothed.jump(progress.get());
        gl.setProgress(progress.get());

        const ro = new ResizeObserver(() => gl.resize());
        ro.observe(canvasRef.current);

        return () => {
            ro.disconnect();
            gl.destroy();
            glRef.current = null;
        };
    }, [disabled, progress, smoothed]);

    useMotionValueEvent(driver, "change", (v) => {
        glRef.current?.setProgress(v);
    });

    if (fallback) {
        return (
            <motion.div
                className="fixed inset-0 -z-10 pointer-events-none"
                style={{ opacity: driver, ...DARK_PANEL }}
                aria-hidden="true"
            />
        );
    }

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 h-full w-full pointer-events-none"
            aria-hidden="true"
        />
    );
}
