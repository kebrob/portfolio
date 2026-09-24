import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Neighbour = { slug: string; title: string };

/*
 * Previous / next project, under the index. Full-bleed rows with the archive's
 * own hover inversion, so it reads as the next line of the index rather than as
 * a pair of buttons. Curated order, wrapping round, so there is always
 * somewhere to go.
 */
export default function ProjectPager({ prev, next }: { prev: Neighbour; next: Neighbour }) {
    const t = useTranslations("project");

    const row =
        "hoverable group flex flex-col gap-3 px-gutter py-10 transition-colors duration-300 hover:bg-[var(--page-inv)] hover:text-[var(--page-inv-fg)] md:py-12";
    const label =
        "font-mono text-mini tracking-label text-[var(--page-faint)] uppercase transition-colors duration-300 group-hover:text-[var(--page-inv-faint)]";
    const title =
        "text-2xl leading-[1.05] font-bold tracking-[-0.03em] transition-transform duration-300 md:text-4xl";

    return (
        <nav
            aria-label={t("moreWork")}
            className="theme-fade grid border-t border-[var(--page-rule)] text-[var(--page-fg)] md:grid-cols-2"
        >
            <Link
                href={`/project/${prev.slug}`}
                className={`${row} border-b border-[var(--page-rule-soft)] md:border-r md:border-b-0`}
            >
                <span className={label}>
                    <span aria-hidden="true">← </span>
                    {t("previous")}
                </span>
                <span className={`${title} group-hover:-translate-x-1`}>{prev.title}</span>
            </Link>
            <Link href={`/project/${next.slug}`} className={`${row} md:items-end md:text-right`}>
                <span className={label}>
                    {t("next")}
                    <span aria-hidden="true"> →</span>
                </span>
                <span className={`${title} group-hover:translate-x-1`}>{next.title}</span>
            </Link>
        </nav>
    );
}
