/*
 * A minimal WebGL2 runner for the fullscreen-quad ink transition. No scene
 * graph, no dependency: one quad, one program, one draw call per frame. The
 * shader supplies only an `inkShape(vec2 uv, float p)` function (see the
 * contract below); the shared main() paints it in the portfolio's dark-section
 * colour, dot grid included, so the section arrives complete rather than as flat
 * black.
 *
 * Frames are drawn on demand — setProgress schedules one — so a page sitting
 * still costs nothing. That is also what makes this cheap on mobile: the shader
 * only runs while the transition is actually moving.
 */

const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
    vUv = aPos * 0.5 + 0.5;
    gl_Position = vec4(aPos, 0.0, 1.0);
}`;

/*
 * cnoise is Stefan Gustavson's classic Perlin noise from webgl-noise (MIT) —
 * the same implementation the reference site compiles into its overlay shader.
 */
const FRAG_HEADER = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uProgress;
uniform float uSeed;
uniform float uDpr;

in vec2 vUv;
out vec4 outColor;

vec2 fade(vec2 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
    Pi = mod(Pi, 289.0);
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = 1.79284291400159 - 0.85373472095314 *
        vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
    g00 *= norm.x;
    g01 *= norm.y;
    g10 *= norm.z;
    g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
    return 2.3 * n_xy;
}

`;

/*
 * The contract:
 *   vec2 inkShape(vec2 uv, float p) -> (coverage, density)
 *
 * Density models ink soaking into paper. At density 0 the ink is a thin
 * translucent wash and the graph paper still reads through it; at density 1 it
 * is exactly .dark-section — opaque grey-6 (hsl(0 0% 6%) = #0f0f0f) with the dot
 * grid at 2.5% white on a 20px lattice. Keep those in sync with globals.css.
 *
 * The dots fade in with density rather than being painted at full strength from
 * the first frame, so a thin wash does not show the dark section's texture
 * before any ink has actually pooled.
 */
const FRAG_MAIN = `
void main() {
    vec2 s = inkShape(vUv, uProgress);
    float cover = clamp(s.x, 0.0, 1.0);
    float dens = clamp(s.y, 0.0, 1.0);

    // Opacity has to climb much faster than darkness. If both ramp together, the
    // paper keeps showing through the mid tones and every tonal shader collapses
    // into one long soft gradient — the tone must be carried by the ink colour,
    // not by how much paper is still visible behind it.
    float a = cover * mix(0.62, 1.0, min(dens * 2.2, 1.0));
    vec3 ink = mix(vec3(0.38), vec3(0.0588), dens);

    // Measure the dot lattice from the TOP-left. gl_FragCoord's origin is the
    // bottom-left, but .dark-section's dots use background-attachment: fixed,
    // which anchors to the viewport's top-left — sampling from the bottom would
    // offset the two lattices by whatever (viewport height mod 20) happens to be
    // and put a visible step in the dots at the seam.
    vec2 fc = vec2(gl_FragCoord.x, uResolution.y - gl_FragCoord.y);
    vec2 cell = mod(fc, 20.0 * uDpr) - 10.0 * uDpr;
    float dot = 1.0 - smoothstep(1.5 * uDpr - 0.6, 1.5 * uDpr + 0.6, length(cell));
    vec3 col = mix(ink, vec3(1.0), dot * 0.025 * dens);

    outColor = vec4(col, a);
}`;

export interface GlTransition {
    setProgress(p: number): void;
    resize(): void;
    destroy(): void;
}

function compile(gl: WebGL2RenderingContext, type: number, src: string) {
    const sh = gl.createShader(type)!;
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        const log = gl.getShaderInfoLog(sh);
        gl.deleteShader(sh);
        throw new Error(`shader compile failed: ${log}`);
    }
    return sh;
}

export interface GlTransitionOptions {
    /**
     * Ceiling on the device pixel ratio. Fill cost scales with its square, and
     * these shaders are ALU-heavy, so phones are worth capping below 2 — the edge
     * is antialiased with fwidth, so it stays crisp at a lower ratio.
     */
    maxDpr?: number;
}

export function createGlTransition(
    canvas: HTMLCanvasElement,
    shapeGlsl: string,
    options: GlTransitionOptions = {}
): GlTransition | null {
    const maxDpr = options.maxDpr ?? 2;
    const gl = canvas.getContext("webgl2", {
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        // Non-premultiplied so the shader can output straight colour + alpha.
        premultipliedAlpha: false,
        powerPreference: "low-power",
    });
    if (!gl) return null;

    let program: WebGLProgram;
    try {
        const vs = compile(gl, gl.VERTEX_SHADER, VERT);
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG_HEADER + shapeGlsl + FRAG_MAIN);
        program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(`link failed: ${gl.getProgramInfoLog(program)}`);
        }
    } catch (err) {
        console.error("[ink] transition shader", err);
        return null;
    }

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

    const loc = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    const uResolution = gl.getUniformLocation(program, "uResolution");
    const uProgress = gl.getUniformLocation(program, "uProgress");
    const uSeed = gl.getUniformLocation(program, "uSeed");
    const uDpr = gl.getUniformLocation(program, "uDpr");

    let progress = 0;
    const seed = Math.random() * 100;
    let frame = 0;
    let dpr = 1;
    let destroyed = false;

    const draw = () => {
        frame = 0;
        if (destroyed) return;
        gl.useProgram(program);
        gl.uniform2f(uResolution, canvas.width, canvas.height);
        gl.uniform1f(uProgress, progress);
        gl.uniform1f(uSeed, seed);
        gl.uniform1f(uDpr, dpr);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const schedule = () => {
        if (frame || destroyed) return;
        frame = requestAnimationFrame(draw);
    };

    const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
        const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
        const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
        if (canvas.width !== w || canvas.height !== h) {
            canvas.width = w;
            canvas.height = h;
            gl.viewport(0, 0, w, h);
        }
        schedule();
    };

    resize();

    return {
        setProgress(p) {
            progress = p;
            schedule();
        },
        resize,
        destroy() {
            destroyed = true;
            if (frame) cancelAnimationFrame(frame);
            gl.deleteProgram(program);
            gl.deleteBuffer(buf);
            gl.getExtension("WEBGL_lose_context")?.loseContext();
        },
    };
}
