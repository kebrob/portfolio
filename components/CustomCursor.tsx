"use client";

import { useEffect, useState } from "react";

/*
 * The dot that replaces the system cursor.
 *
 * The whole component is one bug's worth of care: it used to hide itself on
 * `mouseleave` at the document, and a route change fires exactly that event —
 * the element under the pointer is torn out of the DOM, the browser reports the
 * pointer as having left, and nothing brings it back until the mouse moves
 * again. Going to a 404 and back was enough to lose the cursor for good, since
 * the system one is hidden by globals.css and there is nothing left to see.
 *
 * So visibility is decided by coordinates rather than by the event: the only
 * thing that hides the dot is a pointer that is genuinely outside the viewport.
 */
export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const updatePosition = (e: PointerEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            setIsVisible(true);
        };

        const handleElementHover = (e: PointerEvent) => {
            const target = e.target as HTMLElement | null;
            setIsHovering(
                Boolean(
                    target?.closest?.("a, button, .hoverable") ||
                    target?.classList?.contains("hoverable")
                )
            );
            setIsVisible(true);
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
            if (!inside) setIsVisible(false);
        };

        window.addEventListener("pointermove", updatePosition, { passive: true });
        window.addEventListener("pointerover", handleElementHover, { passive: true });
        document.addEventListener("mouseout", handleOut);

        return () => {
            window.removeEventListener("pointermove", updatePosition);
            window.removeEventListener("pointerover", handleElementHover);
            document.removeEventListener("mouseout", handleOut);
        };
    }, []);

    /*
     * Rendered even while hidden, and faded with opacity instead. Unmounting
     * threw away the last known position, so the dot could only come back at
     * the next mousemove — the other half of the disappearing-cursor bug.
     */
    return (
        <div
            aria-hidden="true"
            className={`custom-cursor ${isHovering ? "hovering" : ""}`}
            style={{
                left: position.x - 6,
                top: position.y - 6,
                opacity: isVisible ? 1 : 0,
            }}
        />
    );
}
