import type { Metadata } from "next";
import { getFormatter, getMessages, getTranslations } from "next-intl/server";
import ThemedPage from "@/components/ThemedPage";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
import { BackLink } from "@/components/project/kit";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { resolveProjects } from "@/lib/projects";
import { alternatesFor } from "@/lib/seo";

/*
 * The archive, as an index rather than a gallery.
 *
 * One full-bleed row per project — number, title, role, stack, year — with no
 * cards and nothing decorative that is not a rule or a column header, so it
 * stays a list at forty entries.
 *
 * The one gesture is the hover: a row inverts to the opposite ground, the same
 * move the nav's contact button makes. It does the work a thumbnail usually
 * does — telling you where you are — which matters because there is no imagery
 * to do it with.
 *
 * Colours come from the --page-* tokens, so both this page and the detail page
 * follow the paper/ink switch. See globals.css and lib/page-theme.tsx.
 */

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "archive" });
    return {
        title: t("metaTitle"),
        description: t("metaDescription"),
        alternates: alternatesFor(locale, "/projects"),
    };
}

/*
 * The column track, shared by the sticky header and every row so the two cannot
 * drift. Below md it collapses to number + title, and the remaining fields fold
 * into one meta line under the title.
 */
const COLUMNS = "grid-cols-[3.5rem_1fr] md:grid-cols-[5rem_minmax(0,1.6fr)_1fr_1fr_5rem]";

export default async function ProjectsPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "archive" });
    const tProject = await getTranslations({ locale, namespace: "project" });
    const format = await getFormatter({ locale });
    const projects = resolveProjects((await getMessages({ locale })).projectContent);

    // Newest first. lib/projects.ts is in curated order — that is the right
    // order for the home page's featured three, and the wrong one for an
    // archive, where the year column is the thing being scanned.
    const entries = [...projects].sort((a, b) => b.year - a.year);

    return (
        <ThemedPage>
            {/*
             * theme-fade on the container, not only on the pieces that set their
             * own colour: everything below inherits --page-fg from here, and an
             * inherited colour follows whatever its ancestor is animating.
             */}
            <div className="theme-fade pt-32 pb-40 text-[var(--page-fg)]">
                <header className="px-gutter">
                    <div className="mb-24 flex items-center justify-between gap-6">
                        <BackLink href="/" label={t("backHome")} />

                        <PaperInkToggle />
                    </div>

                    <h1 className="text-[clamp(3rem,11vw,9rem)] leading-[0.85] font-bold tracking-[-0.04em]">
                        {t("title")}
                    </h1>
                </header>

                {/*
                 * Column headers stick under the nav band — top-11 clears it
                 * rather than sliding under its text.
                 */}
                <div className="page-veil theme-fade sticky top-11 z-20 mt-20 border-y border-[var(--page-rule)]">
                    <div
                        className={`grid ${COLUMNS} theme-fade gap-4 px-gutter py-3 font-mono text-mini tracking-caps text-[var(--page-faint)] uppercase`}
                    >
                        <span>{t("columns.number")}</span>
                        <span>{t("columns.project")}</span>
                        <span className="hidden md:block">{t("columns.role")}</span>
                        <span className="hidden md:block">{t("columns.stack")}</span>
                        <span className="hidden text-right md:block">{t("columns.year")}</span>
                    </div>
                </div>

                <ul>
                    {entries.map((project, index) => (
                        <li
                            key={project.slug}
                            className="theme-fade border-b border-[var(--page-rule-soft)]"
                        >
                            <Link
                                href={`/project/${project.slug}`}
                                className={`hoverable group grid ${COLUMNS} items-baseline gap-4 px-gutter py-7 transition-colors duration-300 hover:bg-[var(--page-inv)] hover:text-[var(--page-inv-fg)] md:py-8`}
                            >
                                <span className="font-mono text-mini text-[var(--page-faint)] tabular-nums transition-colors duration-300 group-hover:text-[var(--page-inv-faint)]">
                                    {format.number(index + 1, { minimumIntegerDigits: 2 })}
                                </span>

                                {/* min-w-0: a grid track will not shrink below its longest word
                                    otherwise, and one long compound pushes the page sideways. */}
                                <span className="flex min-w-0 items-baseline gap-4">
                                    <span className="min-w-0 text-2xl leading-[1.05] font-bold tracking-[-0.03em] transition-transform duration-300 group-hover:translate-x-1 md:text-4xl">
                                        {project.title}
                                    </span>
                                    {/* Arrow rides in from the title, not from the row edge. On
                                        touch screens there is no hover to bring it in, so it
                                        rests there faintly: the one sign a row is a link. */}
                                    <span
                                        aria-hidden="true"
                                        className="translate-x-[-6px] font-mono text-lg opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100 pointer-coarse:translate-x-0 pointer-coarse:opacity-50"
                                    >
                                        ↗
                                    </span>
                                </span>

                                <span className="hidden font-mono text-mini tracking-meta text-[var(--page-muted)] uppercase transition-colors duration-300 group-hover:text-[var(--page-inv-muted)] md:block">
                                    {project.role}
                                </span>

                                <span className="hidden font-mono text-mini tracking-meta text-[var(--page-muted)] uppercase transition-colors duration-300 group-hover:text-[var(--page-inv-muted)] md:block">
                                    {project.stack.slice(0, 3).join(" · ")}
                                </span>

                                <span className="hidden text-right font-mono text-mini text-[var(--page-faint)] tabular-nums transition-colors duration-300 group-hover:text-[var(--page-inv-faint)] md:block">
                                    {project.year}
                                </span>

                                <span className="col-start-2 -mt-3 font-mono text-mini tracking-meta text-[var(--page-faint)] uppercase transition-colors duration-300 group-hover:text-[var(--page-inv-faint)] md:hidden">
                                    {tProject("meta", { year: project.year, role: project.role })}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </ThemedPage>
    );
}
