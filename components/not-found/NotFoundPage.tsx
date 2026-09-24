import { useTranslations } from "next-intl";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
import { BackLink, GUTTER } from "@/components/project/kit";
import { Link } from "@/i18n/navigation";
import Cat from "./Cat";

/*
 * The 404: the cat takes the place of the zero.
 *
 * The chrome — back link and paper/ink toggle at pt-32 — is where the archive
 * index and the project cover both put theirs, so the 404 reads as a missing
 * page rather than a broken one.
 *
 * The numerals and the cat share a baseline and are sized off the same clamp, so
 * the three glyphs stay one word at every width.
 */
export default function NotFoundPage() {
    const t = useTranslations("notFound");

    return (
        <div className="theme-fade flex min-h-screen flex-col pb-32 text-[var(--page-fg)]">
            <div className={`flex items-center justify-between gap-6 pt-32 ${GUTTER}`}>
                <BackLink href="/" label={t("backHome")} />
                <PaperInkToggle />
            </div>

            <div className={`flex flex-1 flex-col justify-center py-16 ${GUTTER}`}>
                <div className="flex items-end justify-center gap-[0.06em] md:gap-[0.02em]">
                    <span className="text-[clamp(6rem,26vw,18rem)] leading-[0.78] font-bold tracking-[-0.06em]">
                        4
                    </span>
                    <Cat label={t("catLabel")} className="w-[clamp(5.5rem,25vw,17rem)] shrink-0" />
                    <span className="text-[clamp(6rem,26vw,18rem)] leading-[0.78] font-bold tracking-[-0.06em]">
                        4
                    </span>
                </div>

                <div className="mt-16 flex flex-col items-center text-center">
                    <h1 className="max-w-[22ch] text-[clamp(1.6rem,4.5vw,2.75rem)] leading-[1.1] font-bold tracking-[-0.03em]">
                        {t("title")}
                    </h1>
                    <p className="theme-fade mt-6 max-w-[44ch] text-[18px] leading-[1.55] text-[var(--page-muted)] md:text-[20px]">
                        {t("body")}
                    </p>

                    <div className="theme-fade mt-12 flex flex-wrap items-center gap-x-8 gap-y-4 font-mono text-xs tracking-caps uppercase">
                        <Link
                            href="/projects"
                            className="hoverable border-b border-[var(--page-rule)] pb-1 hover:border-[var(--page-fg)]"
                        >
                            {t("browseArchive")}
                        </Link>
                        <Link
                            href={{ pathname: "/", hash: "contact" }}
                            className="hoverable border-b border-transparent pb-1 text-[var(--page-muted)] hover:border-[var(--page-rule)] hover:text-[var(--page-fg)]"
                        >
                            {t("reportBroken")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
