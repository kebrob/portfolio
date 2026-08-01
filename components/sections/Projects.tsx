import Link from "next/link";
import { projects } from "@/lib/projects";

/*
 * A wall of post-it notes on the dark dot grid: three project notes plus a
 * fourth, blank one that *is* the link to the full archive — there is no button.
 *
 * This section is in normal flow with automatic height. It used to render inside
 * ProjectsTransition's pinned `h-screen overflow-hidden` panel, where anything
 * past 100vh was unreachable rather than merely hidden, and every vertical value
 * needed a compact base plus a `tall:` variant to fit. None of that applies now.
 */

const FEATURED_COUNT = 3;

/*
 * Note colours stay literals rather than @theme tokens: they are selected by
 * card index here in JS, so a token would only add indirection — the same call
 * the Header's COLORS map makes.
 *
 * `fold` is the shaded underside of the curled corner, `ink` the title, `meta`
 * the mono labels, `rule` the hairline above the footer.
 */
const NOTE_PALETTE = [
    {
        bg: "oklch(0.87 0.105 92)",
        fold: "oklch(0.75 0.085 92)",
        ink: "oklch(0.27 0.03 92)",
        meta: "rgba(46,36,4,0.58)",
        rule: "rgba(46,36,4,0.2)",
    },
    {
        bg: "oklch(0.83 0.062 240)",
        fold: "oklch(0.71 0.05 240)",
        ink: "oklch(0.27 0.035 250)",
        meta: "rgba(16,26,48,0.58)",
        rule: "rgba(16,26,48,0.2)",
    },
    {
        bg: "oklch(0.82 0.078 12)",
        fold: "oklch(0.7 0.062 12)",
        ink: "oklch(0.28 0.035 12)",
        meta: "rgba(48,22,24,0.58)",
        rule: "rgba(48,22,24,0.2)",
    },
];

const ARCHIVE_PALETTE = {
    bg: "oklch(0.9 0.006 250)",
    fold: "oklch(0.78 0.006 250)",
    ink: "oklch(0.26 0.004 250)",
    meta: "rgba(24,24,28,0.5)",
    rule: "rgba(24,24,28,0.2)",
};

/*
 * Scatter across the 12-column grid. Column starts, vertical offsets and
 * rotations are the design's; each note straightens a little and lifts on hover
 * (see `.note` in globals.css — the angles arrive as custom properties because a
 * Tailwind `hover:` utility cannot compose three transform functions around two
 * per-note values).
 *
 * Below `md` the grid is a single column and the offsets drop away, but the
 * rotations stay so the stack still reads as pinned paper rather than a list.
 */
const PLACEMENT = [
    { position: "md:col-start-1 md:mt-0", rot: "-1.4deg", rotHover: "-0.3deg", scale: "1.015" },
    { position: "md:col-start-7 md:mt-[46px]", rot: "0deg", rotHover: "0deg", scale: "1.015" },
    { position: "md:col-start-3 md:mt-[64px]", rot: "2deg", rotHover: "0.4deg", scale: "1.015" },
    { position: "md:col-start-8 md:mt-[22px]", rot: "-1.8deg", rotHover: "-0.4deg", scale: "1.03" },
];

type Palette = (typeof NOTE_PALETTE)[number];

/*
 * The note's paper: square sheet, gloss, and the folded corner. Sizes are in
 * `cqw` against the <Link> container so a note keeps the design's proportions at
 * every column width; the mono labels are the exception, pinned to px so they
 * stay legible on a phone.
 */
function Note({
    href,
    index,
    palette,
    children,
}: {
    href: string;
    index: number;
    palette: Palette;
    children: React.ReactNode;
}) {
    const placement = PLACEMENT[index];

    return (
        <Link
            href={href}
            className={`note hoverable @container block w-[92%] md:w-auto md:col-span-4 md:justify-self-stretch ${
                index % 2 === 0 ? "justify-self-start" : "justify-self-end"
            } ${placement.position}`}
            style={
                {
                    "--note-rot": placement.rot,
                    "--note-rot-hover": placement.rotHover,
                    "--note-scale-hover": placement.scale,
                } as React.CSSProperties
            }
        >
            <div
                className="relative flex aspect-square flex-col justify-between px-[7.6cqw] pt-[8.6cqw] pb-[7.6cqw]"
                style={{
                    backgroundColor: palette.bg,
                    boxShadow: "0 1px 1px rgba(0,0,0,0.5), 0 26px 40px -26px rgba(0,0,0,0.95)",
                }}
            >
                {/* Gloss: shading across the whole sheet, plus a highlight along the top edge */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        backgroundImage:
                            "linear-gradient(190deg, rgba(255,255,255,0.4) 0%, transparent 34%, rgba(0,0,0,0.09) 100%)",
                    }}
                />
                <div
                    className="pointer-events-none absolute top-0 left-[16%] h-[8.6cqw] w-[68%]"
                    style={{
                        backgroundImage:
                            "linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0))",
                    }}
                />

                {/*
                 * Dog-ear, two stacked triangles: the page background cuts the
                 * corner off the sheet, then the fold curls back over the cut.
                 * The cut uses --color-grey-6 (the .dark-section background), not
                 * the design's #0a0a0a, so it disappears into the page.
                 */}
                <div
                    className="pointer-events-none absolute right-0 bottom-0 size-[13.2cqw]"
                    style={{
                        backgroundImage:
                            "linear-gradient(315deg, var(--color-grey-6) 0 50%, transparent 50%)",
                    }}
                />
                <div
                    className="pointer-events-none absolute right-[0.5cqw] bottom-[0.5cqw] size-[11.7cqw]"
                    style={{
                        backgroundImage: `linear-gradient(315deg, ${palette.fold} 0 50%, transparent 50%)`,
                        boxShadow: "-3px -3px 8px -3px rgba(0,0,0,0.45)",
                    }}
                />

                {children}
            </div>
        </Link>
    );
}

function NoteHeader({ left, right, palette }: { left: string; right: string; palette: Palette }) {
    return (
        <div
            className="relative flex justify-between font-mono text-[10px] md:text-[11px] tracking-[0.18em] uppercase"
            style={{ color: palette.meta }}
        >
            <span>{left}</span>
            <span>{right}</span>
        </div>
    );
}

function NoteTitle({ children, palette }: { children: React.ReactNode; palette: Palette }) {
    return (
        <h3
            className="relative font-bold text-[10.6cqw] leading-[0.94] tracking-[-0.04em]"
            style={{ color: palette.ink }}
        >
            {children}
        </h3>
    );
}

export default function Projects() {
    const featured = projects.slice(0, FEATURED_COUNT);
    const remaining = projects.length - FEATURED_COUNT;

    return (
        <section
            id="projects"
            className="dark-section px-[6.7vw] pt-20 md:pt-[110px] pb-40 md:pb-[28vh]"
            /*
             * Keeps .dark-section for its text colour and because the Header's
             * intersection check watches that class, but drops the background it
             * normally paints: the dark here comes from the fixed ink backdrop
             * behind the page. An opaque background of its own would hide the ink
             * entirely and the wall would arrive already black.
             */
            style={{ backgroundColor: "transparent", backgroundImage: "none" }}
        >
            {/* 1248px = the design's 1440px canvas minus its 96px side padding */}
            <div className="mx-auto max-w-[1248px]">
                {/* Same treatment as About's section label */}
                <span className="font-mono text-xs uppercase tracking-[0.3em] mb-16 block">
                    Featured Work
                </span>

                <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8">
                    {featured.map((project, i) => {
                        const palette = NOTE_PALETTE[i];

                        return (
                            <Note
                                key={project.slug}
                                href={`/project/${project.slug}`}
                                index={i}
                                palette={palette}
                            >
                                <NoteHeader
                                    left={`No. ${String(i + 1).padStart(2, "0")}`}
                                    right={project.year}
                                    palette={palette}
                                />

                                <NoteTitle palette={palette}>{project.title}</NoteTitle>

                                {/* pr clears the dog-ear so a long value never runs under the fold */}
                                <div
                                    className="relative flex flex-col gap-[1.8cqw] border-t pt-[3.6cqw] pr-[11.2cqw] font-mono text-[9px] md:text-[10px] tracking-[0.14em] uppercase"
                                    style={{ color: palette.meta, borderColor: palette.rule }}
                                >
                                    <div className="flex justify-between gap-3">
                                        <span>Role</span>
                                        <span className="text-right">{project.role}</span>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <span>Stack</span>
                                        <span className="text-right">
                                            {project.tech.slice(0, 2).join(" · ")}
                                        </span>
                                    </div>
                                </div>
                            </Note>
                        );
                    })}

                    {/* The fourth note is the archive link — blank stock, no button */}
                    <Note href="/projects" index={FEATURED_COUNT} palette={ARCHIVE_PALETTE}>
                        <NoteHeader
                            left="Index"
                            right={`+ ${remaining}`}
                            palette={ARCHIVE_PALETTE}
                        />

                        <NoteTitle palette={ARCHIVE_PALETTE}>Every project</NoteTitle>

                        <div
                            className="relative flex items-end justify-between border-t pt-[3.6cqw] pr-[11.2cqw] font-mono text-[9px] md:text-[10px] tracking-[0.14em] uppercase"
                            style={{
                                color: ARCHIVE_PALETTE.meta,
                                borderColor: ARCHIVE_PALETTE.rule,
                            }}
                        >
                            <span>Full archive</span>
                            <span
                                className="text-[5cqw] leading-[0.8]"
                                style={{ color: ARCHIVE_PALETTE.ink }}
                            >
                                &#8599;
                            </span>
                        </div>
                    </Note>
                </div>
            </div>
        </section>
    );
}
