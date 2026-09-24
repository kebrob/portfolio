/*
 * The ink bleed transition, used on the live page between Experience and the
 * projects wall.
 *
 * Contract (see gl-transition.ts): returns (coverage, density) for progress p.
 *   coverage — how much of the pixel the ink has reached, 0..1
 *   density  — how far the ink has soaked in; 0 is a thin translucent wash,
 *              1 is saturated .dark-section
 *
 * Both must reach 1 everywhere at p = 1 or the section never finishes turning
 * dark.
 *
 * THE SHAPE OF THIS THING
 *
 * Not a hard front sweeping bottom-to-top. The reference's whole overlay is one
 * quad with
 *
 *     alpha = mix(1.0, cnoise(...) * 3.0 + 0.4, uStart0) * uStart2
 *
 * — a Perlin field amplified until most of it clips to fully-opaque or
 * fully-transparent, multiplied by a *global* opacity. There is no front. Mid
 * transition the entire viewport is a single mottled wash, denser at the
 * bottom, and it fades in everywhere at once. The "swallowed from below" read
 * comes from the field being biased low at the top, not from anything
 * travelling.
 *
 * That is also why it cannot feel static: a front has a position you can park
 * on, a global fade has no position at all. It is either happening or it isn't.
 *
 * So the three phases below are its three tweens, collapsed onto one p:
 *   veil   — the global fade (its uStart2), p 0.18..0.72
 *   solid  — mottle flattening into a flat fill (its uStart0), p 0.68..1
 *   field  — the noise sampling window sliding, across the whole of p
 *
 * The veil deliberately does not use the whole range. Nothing happens for the
 * first fifth and the last quarter is only the mottle closing up, so the actual
 * light-to-dark flip lands in a little over half the scroll range and is eased
 * on top of that. Spreading it evenly over the full range is what made this
 * read as slow no matter how short the range got.
 */
export const INK_BLEED_GLSL = `
vec2 inkShape(vec2 uv, float p) {
    // Global fade. smoothstep's own ease on top of the window, so the flip is
    // concentrated in the middle of an already narrow band.
    float veil = smoothstep(0.18, 0.72, p);

    // Mottle -> flat fill. Until this engages the ink keeps its blotchy edges;
    // it is what guarantees full coverage at p = 1 regardless of the field.
    float solid = smoothstep(0.68, 1.0, p);

    /*
     * The field, and note that p appears NOWHERE in it. That is load-bearing.
     *
     * The reference drifts its sampling window with p. Copying that here made
     * per-pixel coverage non-monotonic: a lobe drifting away from a pixel could
     * outrun the level rising toward it, and patches that had gone dark went
     * light again — a flicker at the top of the frame.
     *
     * Frozen, coverage is clamp(constant + rising) — monotonic per pixel by
     * construction, so nothing can ever un-darken. The life comes from lobes
     * opening, growing and merging as the level rises through them, which is the
     * part that actually reads as ink swallowing paper.
     */
    float n = cnoise(vec2(uv.x * 2.00 + uSeed, uv.y * 1.35 + uSeed * 0.7)) * 1.50;

    // One finer octave, well under the base. Pure cnoise is glassy; ink is not.
    n += cnoise(vec2(uv.x * 4.3 - uSeed, uv.y * 3.1 + uSeed)) * 0.45;

    /*
     * Vertical tilt, roughly the same span as the field above. That ratio is the
     * whole bottom-to-top read: much less and which lobe opened first is down to
     * the noise; matched, a pixel at the bottom needs the level to rise
     * 2.6 less far than one at the top, so the flood is clearly a rising one and
     * only an unusually strong peak lets the top lead. Push it much past this
     * and the raggedness stops mattering — it becomes a horizon line again.
     */
    float tilt = (0.5 - uv.y) * 2.6;

    /*
     * The level the field is clipped against, rising through it as p rises.
     * Sweeping past both ends of the combined range of n + tilt guarantees empty
     * at the start and full at the end whatever the seed threw up, which the
     * reference does not need only because its seed is fixed at 0.
     */
    float grow = mix(-2.90, 3.40, smoothstep(0.08, 0.92, p));

    float mottle = clamp(n + grow + tilt, 0.0, 1.0);
    float cover = mix(mottle, 1.0, solid) * veil;

    // Tone deepens with the veil rather than with distance behind a front —
    // there is no front to be behind. Landing at 1 by 0.92 gets the dot grid
    // fully in before the mottle finishes closing.
    float dens = smoothstep(0.25, 0.92, p);

    return vec2(cover, dens);
}`;
