"use client";

import { useEffect, useRef } from "react";

/*
 * The dot that replaces the system cursor.
 *
 * Visibility is decided by coordinates rather than by `mouseleave`: a route
 * change tears the element under the pointer out of the DOM and the browser
 * reports the pointer as having left. The only thing that hides the dot is a
 * pointer that is genuinely outside the viewport.
 *
 * Everything is written straight to the element, not through React state: the
 * handlers fire at pointer rate, and a re-render per mouse move is work the
 * main thread should be spending on the page. Position goes through the
 * `translate` property, which composites, rather than left/top, which lay out;
 * `transform` stays free for the hover scale in globals.css.
 *
 * The system cursor is only hidden once this has mounted, and only for a
 * mouse-like pointer (the has-custom-cursor class on <html>). Before that —
 * or if the script never runs, or on a touch screen — the normal cursor stays.
 */
export default function CustomCursor() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el || !window.matchMedia("(pointer: fine)").matches) return;

        const root = document.documentElement;
        root.classList.add("has-custom-cursor");

        const updatePosition = (e: PointerEvent) => {
            // Touch and pen contacts fire pointermove too; the dot is for the mouse.
            if (e.pointerType !== "mouse") return;
            el.style.translate = `${e.clientX - 6}px ${e.clientY - 6}px`;
            el.style.opacity = "1";
        };

        const handleElementHover = (e: PointerEvent) => {
            if (e.pointerType !== "mouse") return;
            const target = e.target as HTMLElement | null;
            el.classList.toggle(
                "hovering",
                Boolean(
                    target?.closest?.("a, button, .hoverable") ||
                    target?.classList?.contains("hoverable")
                )
            );
            el.style.opacity = "1";
        };

        /*
         * Leaving the window fires mouseout on the document with a null
         * relatedTarget — and so does a navigation that removes the element
         * under the pointer. The events are indistinguishable, which is why the
         * position is what decides.
         */
        const handleOut = (e: MouseEvent) => {
            if (e.relatedTarget) return;
            const { clientX: x, clientY: y } = e;
            const inside = x > 0 && y > 0 && x < window.innerWidth && y < window.innerHeight;
            if (!inside) el.style.opacity = "0";
        };

        window.addEventListener("pointermove", updatePosition, { passive: true });
        window.addEventListener("pointerover", handleElementHover, { passive: true });
        document.addEventListener("mouseout", handleOut);

        return () => {
            root.classList.remove("has-custom-cursor");
            window.removeEventListener("pointermove", updatePosition);
            window.removeEventListener("pointerover", handleElementHover);
            document.removeEventListener("mouseout", handleOut);
        };
    }, []);

    /*
     * Rendered even while hidden, and faded with opacity instead: unmounting
     * would throw away the last known position until the next mousemove.
     */
    return <div ref={ref} aria-hidden="true" className="custom-cursor" style={{ opacity: 0 }} />;
}
