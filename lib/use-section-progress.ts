"use client";

import { RefObject } from "react";
import { useScroll, useTransform } from "framer-motion";

/**
 * 0→1 scroll progress for a pinned section, measured from the moment its top
 * reaches the viewport top until its bottom does.
 *
 * Computed manually from `scrollY` on purpose. useScroll({ target, offset })
 * triggers framer-motion's WAAPI/ScrollTimeline HW-acceleration path (added in
 * 12.37.0), which maps keyframe offsets against the full-document scroll range
 * instead of the section range, breaking the animation. Manual calculation
 * bypasses that — do not "simplify" this back to useScroll({ target }).
 */
export function useSectionProgress(ref: RefObject<HTMLElement | null>) {
    const { scrollY } = useScroll();

    return useTransform(scrollY, (y) => {
        if (!ref.current) return 0;
        const top = ref.current.offsetTop;
        const height = ref.current.offsetHeight;
        const viewH = window.innerHeight;
        return Math.max(0, Math.min(1, (y - top) / (height - viewH)));
    });
}
