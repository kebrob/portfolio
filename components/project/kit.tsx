import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { ArtVariant } from "@/lib/projects";

/*
 * The pieces the project page is built from.
 *
 * Colour is --page-* throughout, never a literal, so every part rides the
 * paper/ink flood exactly as the rest of the page does. Anything painting its
 * own ground uses --page-inv, or it will simply not turn over.
 */

export const GUTTER = "px-gutter";

export function Label({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <span
            className={`theme-fade font-mono text-mini tracking-label text-[var(--page-faint)] uppercase ${className}`}
        >
            {children}
        </span>
    );
}

export function BackLink({ href = "/projects", label }: { href?: string; label?: string }) {
    const t = useTranslations("project");
    return (
        <Link
            href={href}
            /*
             * flex w-fit, not inline-flex: inline-flex lets the cover's other
             * inline content share its line. Block-level with a content-width
             * box keeps the hit area exactly the words.
             */
            className="theme-fade hoverable flex w-fit items-center gap-2 font-mono text-xs tracking-label text-[var(--page-muted)] uppercase hover:text-[var(--page-fg)]"
        >
            <span aria-hidden="true" className="text-base leading-none">
                ←
            </span>
            <span>{label ?? t("backToArchive")}</span>
        </Link>
    );
}

export function VisitButton({ href, label }: { href: string; label: string }) {
    const t = useTranslations("a11y");
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="hoverable theme-fade group inline-flex items-center gap-3 border border-[var(--page-rule)] px-8 py-4 transition-colors duration-300 hover:bg-[var(--page-inv)] hover:text-[var(--page-inv-fg)]"
        >
            <span className="font-mono text-sm tracking-wider uppercase">{label}</span>
            <span
                aria-hidden="true"
                className="font-mono text-base leading-none transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            >
                ↗
            </span>
            <span className="sr-only">{t("opensInNewTab")}</span>
        </a>
    );
}

/** Monogram in place of a photograph — the site has no photography and should not start here. */
export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
    const monogram = name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");

    return (
        <span
            aria-hidden="true"
            style={{ width: size, height: size }}
            className="theme-fade inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--page-rule)] font-mono text-mini tracking-widest text-[var(--page-muted)]"
        >
            {monogram}
        </span>
    );
}

/*
 * No reading time: the page is an index and a short tail, so "4 min read" would
 * describe prose that does not exist. The update date does real work instead —
 * several of these projects are still running.
 */
export function Byline({ author, updated }: { author: string; updated: string }) {
    const t = useTranslations("project");
    return (
        <div className="flex items-center gap-3">
            <Avatar name={author} />
            <div className="leading-tight">
                <div className="theme-fade text-sm font-medium text-[var(--page-fg)]">{author}</div>
                <div className="theme-fade mt-0.5 text-[13px] text-[var(--page-muted)]">
                    {t("updated", { date: updated })}
                </div>
            </div>
        </div>
    );
}

/*
 * Generative figures. All five variants are pure functions of a seed: these render on the server, and anything random would produce one
 * composition in the HTML and a different one after hydration. They draw in
 * currentColor at fractional opacity, so they cross the paper/ink flood with
 * everything else and never need a second palette.
 */
function mulberry32(seed: number) {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

const W = 800;
const H = 450;

function artArcs(rnd: () => number) {
    const cx = W * (0.3 + rnd() * 0.4);
    const cy = H * 0.92;
    return (
        <>
            {Array.from({ length: 14 }, (_, i) => {
                const r = 30 + i * 27 + rnd() * 8;
                return (
                    <circle
                        key={i}
                        cx={cx}
                        cy={cy}
                        r={r}
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity={0.08 + (i % 5) * 0.06}
                        strokeWidth={i % 4 === 0 ? 1.6 : 0.8}
                    />
                );
            })}
            {Array.from({ length: 5 }, (_, i) => {
                const a = Math.PI * (1.05 + rnd() * 0.85);
                const r = 60 + rnd() * 330;
                return (
                    <circle
                        key={`d${i}`}
                        cx={cx + Math.cos(a) * r}
                        cy={cy + Math.sin(a) * r}
                        r={3.5}
                        fill="currentColor"
                        fillOpacity={0.55}
                    />
                );
            })}
        </>
    );
}

function artGrid(rnd: () => number) {
    const cols = 16;
    const rows = 9;
    const cw = W / cols;
    const ch = H / rows;
    const cells = Array.from({ length: cols * rows }, () => rnd());
    return (
        <>
            {cells.map((v, i) =>
                v > 0.82 ? (
                    <rect
                        key={`f${i}`}
                        x={(i % cols) * cw}
                        y={Math.floor(i / cols) * ch}
                        width={cw}
                        height={ch}
                        fill="currentColor"
                        fillOpacity={0.1 + (v - 0.82) * 2.4}
                    />
                ) : null
            )}
            {Array.from({ length: cols + 1 }, (_, i) => (
                <line
                    key={`v${i}`}
                    x1={i * cw}
                    y1={0}
                    x2={i * cw}
                    y2={H}
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    strokeWidth={0.7}
                />
            ))}
            {Array.from({ length: rows + 1 }, (_, i) => (
                <line
                    key={`h${i}`}
                    x1={0}
                    y1={i * ch}
                    x2={W}
                    y2={i * ch}
                    stroke="currentColor"
                    strokeOpacity={0.12}
                    strokeWidth={0.7}
                />
            ))}
        </>
    );
}

function artWave(rnd: () => number) {
    const lines = 7;
    return (
        <>
            {Array.from({ length: lines }, (_, l) => {
                const phase = rnd() * Math.PI * 2;
                const amp = 22 + rnd() * 46;
                const freq = 1.4 + rnd() * 1.8;
                const base = (H / (lines + 1)) * (l + 1);
                const pts = Array.from({ length: 81 }, (_, i) => {
                    const x = (i / 80) * W;
                    const y = base + Math.sin(phase + (i / 80) * Math.PI * freq * 2) * amp;
                    return `${x.toFixed(1)},${y.toFixed(1)}`;
                }).join(" ");
                return (
                    <polyline
                        key={l}
                        points={pts}
                        fill="none"
                        stroke="currentColor"
                        strokeOpacity={l === 3 ? 0.7 : 0.16 + (l % 3) * 0.07}
                        strokeWidth={l === 3 ? 1.8 : 0.9}
                    />
                );
            })}
        </>
    );
}

function artBars(rnd: () => number) {
    const n = 26;
    const gap = 6;
    const bw = (W - gap * (n - 1)) / n;
    const peak = Math.floor(rnd() * n);
    return (
        <>
            <line
                x1={0}
                y1={H - 1}
                x2={W}
                y2={H - 1}
                stroke="currentColor"
                strokeOpacity={0.3}
                strokeWidth={1}
            />
            {Array.from({ length: n }, (_, i) => {
                const h = (0.12 + Math.pow(rnd(), 1.7) * 0.85) * H;
                return (
                    <rect
                        key={i}
                        x={i * (bw + gap)}
                        y={H - h}
                        width={bw}
                        height={h}
                        fill="currentColor"
                        fillOpacity={i === peak ? 0.7 : 0.14 + (i % 4) * 0.05}
                    />
                );
            })}
        </>
    );
}

/*
 * An interface reduced to its geometry — bar, rail, columns, blocks — standing
 * in for the screenshots these NDA write-ups cannot publish.
 */
function artPlan(rnd: () => number) {
    const pad = 18;
    const barH = 34;
    const railW = rnd() > 0.4 ? 150 : 0;
    const colX = pad + railW + (railW ? 16 : 0);
    const cols = 2 + Math.floor(rnd() * 2);
    const colW = (W - colX - pad - (cols - 1) * 16) / cols;

    const frame = (
        x: number,
        y: number,
        w: number,
        h: number,
        fill: number,
        key: string | number
    ) => (
        <rect
            key={key}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="currentColor"
            fillOpacity={fill}
            stroke="currentColor"
            strokeOpacity={0.35}
            strokeWidth={1}
        />
    );

    return (
        <>
            {frame(pad, pad, W - pad * 2, H - pad * 2, 0, "outer")}
            {frame(pad, pad, W - pad * 2, barH, 0.06, "bar")}
            {railW > 0 && frame(pad, pad + barH, railW, H - pad * 2 - barH, 0.03, "rail")}

            {railW > 0 &&
                Array.from({ length: 6 }, (_, i) => (
                    <line
                        key={`r${i}`}
                        x1={pad + 18}
                        y1={pad + barH + 34 + i * 30}
                        x2={pad + 18 + 40 + rnd() * 66}
                        y2={pad + barH + 34 + i * 30}
                        stroke="currentColor"
                        strokeOpacity={0.28}
                        strokeWidth={4}
                    />
                ))}

            {Array.from({ length: cols }, (_, c) => {
                const x = colX + c * (colW + 16);
                let y = pad + barH + 20;
                const blocks = [];
                let i = 0;
                while (y < H - pad - 40) {
                    const h = 46 + rnd() * 92;
                    blocks.push(
                        frame(x, y, colW, Math.min(h, H - pad - 16 - y), 0.05, `${c}-${i}`)
                    );
                    // One block per column gets weight, so the plan reads as a
                    // layout with a focus rather than an even lattice.
                    if (rnd() > 0.72) {
                        blocks.push(
                            <rect
                                key={`f${c}-${i}`}
                                x={x + 12}
                                y={y + 12}
                                width={colW * (0.3 + rnd() * 0.5)}
                                height={10}
                                fill="currentColor"
                                fillOpacity={0.45}
                            />
                        );
                    }
                    y += h + 16;
                    i += 1;
                }
                return blocks;
            })}
        </>
    );
}

const ART: Record<ArtVariant, (rnd: () => number) => React.ReactNode> = {
    arcs: artArcs,
    grid: artGrid,
    wave: artWave,
    bars: artBars,
    plan: artPlan,
};

/*
 * How each composition survives a box that is not 16:9 — the cover runs it at
 * full viewport height. Grids, waves and bars stretch without complaint; a
 * taller bar is still a bar. Circles do not: stretched, the arcs become ovals
 * and read as a mistake, so that one crops instead.
 */
const FIT: Record<ArtVariant, string> = {
    arcs: "xMidYMid slice",
    grid: "none",
    wave: "none",
    bars: "none",
    plan: "none",
};

/*
 * How hard each variant is allowed to print behind the cover title.
 *
 * A single opacity for all five does not work, because they are not equally
 * dense. "plan" fills the frame with a wireframe at 0.35 stroke and stretches to
 * fit, so on a 92vh cover it reads as a diagram rather than as ground. "arcs" is thin concentric strokes and slices rather than
 * stretches, so it can carry more before it competes with the headline.
 *
 * Multiplied into the caller's own opacity, so a page can still dim the whole
 * thing without having to know any of this.
 */
export const ART_WEIGHT: Record<ArtVariant, number> = {
    arcs: 1,
    grid: 0.72,
    wave: 0.78,
    bars: 0.62,
    plan: 0.58,
};

export function Art({
    variant,
    seed,
    className = "",
    ratio = "aspect-[16/9]",
    style,
}: {
    variant: ArtVariant;
    seed: number;
    className?: string;
    ratio?: string;
    style?: CSSProperties;
}) {
    return (
        <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio={FIT[variant]}
            role="presentation"
            style={style}
            /*
             * No colour of its own: everything is drawn in currentColor, so the
             * art inherits whatever text colour its container has. Tailwind
             * resolves a clash between a text-* utility set here and one set by
             * the caller by sheet order rather than attribute order, so setting
             * one here would win or lose more or less at random.
             */
            className={`theme-fade block w-full ${ratio} ${className}`}
        >
            {ART[variant](mulberry32(seed))}
        </svg>
    );
}
