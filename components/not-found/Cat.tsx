"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/*
 * A cat sitting upright, seen head-on, as one solid silhouette in currentColor
 * — the same weight as the bold numerals either side of it, so it reads as the
 * middle glyph of the 404 rather than an illustration dropped between them.
 *
 * Every interior detail (eyes, nose, mouth, the line between the front legs) is
 * cut out of the silhouette with a mask rather than painted on in a background
 * colour. These pages have no background colour to paint with: the ground is
 * the ink canvas, mid-flood it is half one colour and half the other, and a
 * cut-out is simply correct over whatever is behind it.
 *
 * The tail animates its shape, not its rotation: framer-motion resolves a
 * transform origin against the tail's own bounding box, so a rotating tail slid
 * away from the body. Morphing the path keeps the first point tucked inside the
 * haunch, so there is no joint to come apart.
 */

const BODY =
    "M74 80C70 58 74 36 80 22Q82 16 86 21L108 48Q120 44 132 48L154 21Q158 16 160 22" +
    "C166 36 170 58 166 80C174 92 176 110 168 122C164 128 158 132 154 134" +
    "C170 150 188 180 192 214C194 238 186 256 170 256L70 256" +
    "C54 256 46 238 48 214C52 180 70 150 86 134C82 132 76 128 72 122C64 110 66 92 74 80Z";

/*
 * Tail keyframes. Same commands and the same number of values in each, which is
 * what lets the path interpolate; the leading M178 246 never changes.
 */
const TAIL_REST = "M178 246C204 256 234 254 240 236C245 220 236 206 224 209";
const TAIL_LIFT = "M178 246C204 256 236 252 242 232C247 212 240 196 228 194";
const TAIL_CURL = "M178 246C204 256 232 256 238 240C244 226 240 214 230 214";

const WHISKERS = [
    "M104 113L30 103",
    "M104 117L27 119",
    "M105 121L33 134",
    "M136 113L210 103",
    "M136 117L213 119",
    "M135 121L207 134",
];

/* Eyes as carved outlines with slit pupils, so the iris stays the cat's colour. */
const EYES = "M86 90Q97 79 112 95Q98 103 86 90ZM154 90Q143 79 128 95Q142 103 154 90Z";
const PUPILS =
    "M99.5 85Q104 92 99.5 99.5Q95 92 99.5 85ZM140.5 85Q145 92 140.5 99.5Q136 92 140.5 85Z";

const BLINK = {
    animate: { scaleY: [1, 1, 0.08, 1, 1] },
    transition: {
        duration: 5.5,
        times: [0, 0.9, 0.93, 0.96, 1],
        repeat: Infinity,
        ease: "easeInOut",
    },
} as const;

export default function Cat({ label, className = "" }: { label: string; className?: string }) {
    const reduced = usePrefersReducedMotion();
    const id = useId();
    const cutouts = `${id}-cutouts`;
    const outside = `${id}-outside`;

    const blink = reduced ? {} : BLINK;

    return (
        <svg
            viewBox="0 0 260 262"
            role="img"
            aria-label={label}
            fill="none"
            className={`theme-fade block ${className}`}
        >
            <defs>
                <mask id={cutouts} maskUnits="userSpaceOnUse" x="0" y="0" width="260" height="262">
                    <path d={BODY} fill="white" />

                    <motion.g {...blink}>
                        <path d={EYES} stroke="black" strokeWidth={2.4} strokeLinejoin="round" />
                        <path d={PUPILS} fill="black" />
                    </motion.g>

                    <path d="M114 106L126 106Q126 109 120 113Q114 109 114 106Z" fill="black" />

                    <g
                        stroke="black"
                        strokeWidth={2.2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M120 113V117M120 117Q116 122 111 119M120 117Q124 122 129 119" />
                        {/* Inner ear. */}
                        <path d="M84 34Q88 46 99 53M156 34Q152 46 141 53" />
                        {/* Front legs: the outer edge of each, the gap between them. */}
                        <path d="M96 188C93 212 92 234 93 256M144 188C147 212 148 234 147 256" />
                        <path d="M120 206V256" />
                        {/* Hind thighs, where the haunch folds over the back leg. */}
                        <path d="M54 216C68 212 82 222 88 242M186 216C172 212 158 222 152 242" />
                        {/* Toes. */}
                        <path d="M106 250V256M134 250V256" />
                    </g>

                    <g stroke="black" strokeWidth={1.4} strokeLinecap="round">
                        {WHISKERS.map((d) => (
                            <path key={d} d={d} />
                        ))}
                    </g>
                </mask>

                {/* Everything except the cat, so the whiskers only draw past the cheeks. */}
                <mask id={outside} maskUnits="userSpaceOnUse" x="0" y="0" width="260" height="262">
                    <rect width="260" height="262" fill="white" />
                    <path d={BODY} fill="black" />
                </mask>
            </defs>

            {/* Drawn before the body so the base disappears behind the haunch. */}
            {/*
             * The starting shape goes in `initial`, not a plain `d` prop:
             * framer-motion does not seed an animated `d` from the prop, and
             * its first frame would write d="undefined".
             */}
            <motion.path
                initial={{ d: TAIL_REST }}
                stroke="currentColor"
                strokeWidth={15}
                strokeLinecap="round"
                animate={
                    reduced
                        ? undefined
                        : { d: [TAIL_REST, TAIL_LIFT, TAIL_REST, TAIL_CURL, TAIL_REST] }
                }
                transition={{
                    duration: 6,
                    times: [0, 0.22, 0.5, 0.72, 1],
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <path d={BODY} fill="currentColor" mask={`url(#${cutouts})`} />

            <g
                stroke="currentColor"
                strokeWidth={1.4}
                strokeLinecap="round"
                mask={`url(#${outside})`}
            >
                {WHISKERS.map((d) => (
                    <path key={d} d={d} />
                ))}
            </g>
        </svg>
    );
}
