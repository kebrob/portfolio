"use client";

import Link from "next/link";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
import { projects } from "@/lib/projects";
import Cat from "./Cat";

/*
 * Four candidates for the 404, all built from the parts the rest of the site is
 * built from — mono small caps, hairline rules, one headline face, no imagery
 * that is not drawn in currentColor.
 *
 * They are kept together in one file on purpose. Only one of them ships (see
 * app/not-found.tsx, which names it); the other three are here so the choice can
 * be made by looking rather than by remembering, at /lab/404. Once the decision
 * has settled, delete the three that lost and this file becomes the 404.
 *
 * The joke, in all four, is format rather than punchline. A portfolio that keeps
 * a straight face for forty case studies cannot suddenly do comedy typography;
 * what it can do is fill in its own forms wrong.
 */

const GUTTER = "px-5 md:px-10 lg:px-20";

function HomeLink({ label = "Back home" }: { label?: string }) {
    return (
        <Link
            href="/"
            className="theme-fade hoverable inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-[var(--page-muted)] uppercase hover:text-[var(--page-fg)]"
        >
            <span className="text-base leading-none">←</span>
            <span>{label}</span>
        </Link>
    );
}

/*
 * The chrome every candidate shares: back link and paper/ink toggle at pt-32,
 * which is where the archive index and the project cover both put theirs. A 404
 * that moved them would be the one page on the site whose furniture is
 * somewhere else, and that reads as a broken page rather than a missing one.
 */
function Shell({ children }: { children: React.ReactNode }) {
    return (
        <div className="theme-fade flex min-h-screen flex-col pb-32 text-[var(--page-fg)]">
            <div className={`flex items-center justify-between gap-6 pt-32 ${GUTTER}`}>
                <HomeLink />
                <PaperInkToggle />
            </div>
            {children}
        </div>
    );
}

/** A pair of exits, so no candidate is a dead end with a joke on it. */
function Exits() {
    return (
        <div className="theme-fade mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 font-mono text-xs tracking-[0.25em] uppercase">
            <Link
                href="/projects"
                className="hoverable border-b border-[var(--page-rule)] pb-1 hover:border-[var(--page-fg)]"
            >
                Browse the archive
            </Link>
            <Link
                href="/#contact"
                className="hoverable border-b border-transparent pb-1 text-[var(--page-muted)] hover:border-[var(--page-rule)] hover:text-[var(--page-fg)]"
            >
                Tell me what broke
            </Link>
        </div>
    );
}

/** ------------------------------------------------------------- 01 · Index */

/*
 * The archive index, filled in for a page that does not exist.
 *
 * Same column track, same rules, same hover inversion — so for about a second
 * this looks like a normal route, and the joke is the reader noticing what the
 * columns actually say. Under it, three real rows, because the most useful
 * thing a 404 on a portfolio can do is offer the work.
 */
const COLUMNS = "grid-cols-[3.5rem_1fr] md:grid-cols-[5rem_minmax(0,1.6fr)_1fr_1fr_5rem]";

export function NotFoundIndex() {
    const nearest = projects.slice(0, 3);

    return (
        <Shell>
            <header className={`mt-24 ${GUTTER}`}>
                <h1 className="text-[clamp(3rem,11vw,9rem)] leading-[0.85] font-bold tracking-[-0.04em]">
                    Not in the
                    <br />
                    archive
                </h1>
            </header>

            <div className="theme-fade mt-20 border-y border-[var(--page-rule)]">
                <div
                    className={`grid ${COLUMNS} gap-4 px-5 py-3 font-mono text-[10px] tracking-[0.25em] text-[var(--page-faint)] uppercase md:px-10 lg:px-20`}
                >
                    <span>No.</span>
                    <span>Project</span>
                    <span className="hidden md:block">Role</span>
                    <span className="hidden md:block">Stack</span>
                    <span className="hidden text-right md:block">Year</span>
                </div>
            </div>

            <div className="theme-fade border-b border-[var(--page-rule-soft)]">
                <div
                    className={`grid ${COLUMNS} items-baseline gap-4 px-5 py-7 md:px-10 md:py-8 lg:px-20`}
                >
                    <span className="font-mono text-[11px] text-[var(--page-faint)] tabular-nums">
                        404
                    </span>
                    <span className="text-2xl leading-[1.05] font-bold tracking-[-0.03em] md:text-4xl">
                        The Page You Asked For
                    </span>
                    <span className="hidden font-mono text-[11px] tracking-[0.15em] text-[var(--page-muted)] uppercase md:block">
                        Unassigned
                    </span>
                    <span className="hidden font-mono text-[11px] tracking-[0.15em] text-[var(--page-muted)] uppercase md:block">
                        None · Ever
                    </span>
                    <span className="hidden text-right font-mono text-[11px] text-[var(--page-faint)] tabular-nums md:block">
                        —
                    </span>
                    <span className="col-start-2 -mt-3 font-mono text-[10px] tracking-[0.15em] text-[var(--page-faint)] uppercase md:hidden">
                        No year · Unassigned
                    </span>
                </div>
            </div>

            <p
                className={`theme-fade mt-16 max-w-[46ch] text-[19px] leading-[1.5] text-[var(--page-muted)] md:text-[21px] ${GUTTER}`}
            >
                Every other row on this site points at something that was actually built. This one
                is the exception, and it is the only entry I cannot show you.
            </p>

            <div className={GUTTER}>
                <Exits />
            </div>

            <div className="theme-fade mt-24 border-t border-[var(--page-rule)]">
                <span
                    className={`mt-6 block font-mono text-[10px] tracking-[0.3em] text-[var(--page-faint)] uppercase ${GUTTER}`}
                >
                    Rows that do exist
                </span>
                <ul className="mt-4">
                    {nearest.map((project) => (
                        <li
                            key={project.slug}
                            className="theme-fade border-b border-[var(--page-rule-soft)]"
                        >
                            <Link
                                href={`/project/${project.slug}`}
                                className={`hoverable group flex items-baseline justify-between gap-6 px-5 py-5 transition-colors duration-300 hover:bg-[var(--page-inv)] hover:text-[var(--page-inv-fg)] md:px-10 lg:px-20`}
                            >
                                <span className="text-lg leading-tight font-bold tracking-[-0.02em] transition-transform duration-300 group-hover:translate-x-1 md:text-xl">
                                    {project.title}
                                </span>
                                <span className="shrink-0 font-mono text-[11px] text-[var(--page-faint)] tabular-nums transition-colors duration-300 group-hover:text-[var(--page-inv-faint)]">
                                    {project.year}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </Shell>
    );
}

/** ------------------------------------------------------------- 02 · Trace */

/*
 * The search, printed as a log.
 *
 * This is the one that sounds like the person who built the site rather than
 * like the site: the dotted leaders and the aligned results are a build log, and
 * the last two lines are where a build log stops being one. It earns its place
 * because a frontend portfolio is allowed exactly one terminal joke.
 */
const LOG: Array<[string, string]> = [
    ["git log --all", "nothing"],
    ["the other branch", "nothing"],
    ["node_modules", "48,912 files, none of them this"],
    ["the design lab", "thirty drafts, wrong page"],
    ["down the back of the sofa", "one euro, a guitar pick"],
    ["the cat", "declined to comment"],
];

export function NotFoundTrace() {
    return (
        <Shell>
            <div className={`mt-24 ${GUTTER}`}>
                <div className="theme-fade font-mono text-xs tracking-[0.25em] text-[var(--page-faint)] uppercase">
                    Status
                </div>

                <h1 className="mt-6 font-mono text-[clamp(2.4rem,8vw,5.5rem)] leading-[1] font-medium tracking-[-0.03em]">
                    404 <span className="text-[var(--page-faint)]">Not Found</span>
                </h1>

                <div className="theme-fade mt-16 max-w-[60ch] border-t border-[var(--page-rule)] pt-8 font-mono text-[13px] leading-[2] md:text-sm">
                    {LOG.map(([where, result]) => (
                        <div key={where} className="flex items-baseline gap-3">
                            <span className="shrink-0 text-[var(--page-faint)]">checked</span>
                            <span className="shrink-0">{where}</span>
                            <span
                                aria-hidden="true"
                                className="min-w-6 flex-1 translate-y-[-0.3em] border-b border-dotted border-[var(--page-rule)]"
                            />
                            <span className="shrink-0 text-right text-[var(--page-muted)]">
                                {result}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="theme-fade mt-10 max-w-[46ch] text-[19px] leading-[1.5] text-[var(--page-muted)] md:text-[21px]">
                    Exhausted every location. The page is not in any of them, which in my experience
                    means it was never written rather than that it was lost.
                </p>

                <Exits />
            </div>
        </Shell>
    );
}

/** --------------------------------------------------------------- 03 · Cat */

/*
 * The cat takes the place of the zero.
 *
 * The only page on the site with a drawn figure on it, and it gets away with it
 * for two reasons: the cat is a solid silhouette in currentColor, the same
 * weight as the bold numerals beside it, so it reads as the middle glyph rather
 * than a picture; and a 404 is the one page with no work to be respectful of.
 * It is also the only place a portfolio under NDA can say something personal
 * without it being a digression.
 *
 * The copy under it just says what happened and where to go. The cat is the
 * joke; the text does not need to be a second one.
 *
 * The numerals and the cat share a baseline and are sized off the same clamp, so
 * the three glyphs stay one word at every width.
 */
export function NotFoundCat() {
    return (
        <Shell>
            <div className={`flex flex-1 flex-col justify-center py-16 ${GUTTER}`}>
                <div className="flex items-end justify-center gap-[0.06em] md:gap-[0.02em]">
                    <span className="text-[clamp(6rem,26vw,18rem)] leading-[0.78] font-bold tracking-[-0.06em]">
                        4
                    </span>
                    <Cat className="w-[clamp(5.5rem,25vw,17rem)] shrink-0" />
                    <span className="text-[clamp(6rem,26vw,18rem)] leading-[0.78] font-bold tracking-[-0.06em]">
                        4
                    </span>
                </div>

                <div className="mt-16 flex flex-col items-center text-center">
                    <h1 className="max-w-[22ch] text-[clamp(1.6rem,4.5vw,2.75rem)] leading-[1.1] font-bold tracking-[-0.03em]">
                        Nothing here but the cat
                    </h1>
                    <p className="theme-fade mt-6 max-w-[44ch] text-[18px] leading-[1.55] text-[var(--page-muted)] md:text-[20px]">
                        This page doesn&rsquo;t exist, or it has moved. Maybe the link is old, maybe
                        there&rsquo;s a typo in the address.
                    </p>
                    <Exits />
                </div>
            </div>
        </Shell>
    );
}

/** -------------------------------------------------------------- 04 · Type */

/*
 * The number at the size the covers use, bled off both edges.
 *
 * The quietest of the four and the one that scales past the joke: nothing here
 * dates, and it is the only candidate that would still be right on the day the
 * site stops being funny about itself. The humour is a single sentence in the
 * deck, delivered at reading size, and the number does the rest.
 */
export function NotFoundType() {
    return (
        <Shell>
            <div className="flex flex-1 flex-col justify-end">
                <div className={`${GUTTER}`}>
                    <p className="theme-fade mb-10 max-w-[38ch] text-[21px] leading-[1.45] text-[var(--page-muted)] md:text-[26px]">
                        <span className="text-[var(--page-fg)]">
                            This address does not resolve to anything.
                        </span>{" "}
                        I checked twice, which is once more than I checked most of the URLs I have
                        ever typed from memory.
                    </p>
                    <Exits />
                </div>

                {/*
                 * One line rather than three spaced glyphs. Spreading them to
                 * the page edges cropped the outer fours in half and left a
                 * lake between them; set as a word at 30vw it bleeds by a few
                 * percent, which is a bleed rather than a mistake.
                 */}
                <div aria-hidden="true" className="mt-16 overflow-hidden">
                    <div className="-mb-[3vw] text-center text-[30vw] leading-[0.72] font-bold tracking-[-0.07em]">
                        404
                    </div>
                </div>
                <h1 className="sr-only">404 — page not found</h1>
            </div>
        </Shell>
    );
}

/*
 * The roster the lab picker walks. app/not-found.tsx does NOT read this — a
 * server component cannot pull a value out of a "use client" module at module
 * scope (the import is a reference to the boundary, not the array), so the
 * shipping page imports its candidate by name instead.
 */
export const NOT_FOUND_DESIGNS = [
    {
        no: 1,
        name: "Index",
        note: "The archive's own row grammar, filled in wrong.",
        Page: NotFoundIndex,
    },
    {
        no: 2,
        name: "Trace",
        note: "The search for the page, printed as a build log.",
        Page: NotFoundTrace,
    },
    { no: 3, name: "Cat", note: "The cat takes the place of the zero.", Page: NotFoundCat },
    { no: 4, name: "Type", note: "The number as ground, one line of deck.", Page: NotFoundType },
] as const;
