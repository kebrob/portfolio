import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { AUTHOR } from "@/lib/site";

/*
 * The copyright line and the legal links — imprint (§ 5 DDG wants it reachable
 * from every page) and privacy policy. Shared by the home page's contact
 * footer and SiteFooter on every other page, so the two cannot drift. Colour
 * comes from the caller, since the two grounds differ.
 *
 * Inline flow rather than flex, deliberately: the line box then takes its
 * height from the surrounding 16px text. Below sm the links drop to their own
 * line instead of wrapping mid-row.
 */
export default function LegalLinks({ year, className = "" }: { year: number; className?: string }) {
    const t = useTranslations("footer");
    const link =
        "hoverable inline-block font-mono text-xs underline-offset-4 transition-colors duration-300 hover:underline";

    return (
        <div className={className}>
            <span className="font-mono text-xs">{t("copyright", { year, name: AUTHOR })}</span>{" "}
            <span className="mt-1 flex gap-5 sm:mt-0 sm:ms-5 sm:inline-flex">
                <Link href="/imprint" className={link}>
                    {t("imprint")}
                </Link>
                <Link href="/privacy" className={link}>
                    {t("privacy")}
                </Link>
            </span>
        </div>
    );
}
