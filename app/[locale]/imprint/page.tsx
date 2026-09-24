import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ThemedPage from "@/components/ThemedPage";
import LegalAddress from "@/components/layout/LegalAddress";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
import { BackLink, GUTTER, Label } from "@/components/project/kit";
import type { Locale } from "@/i18n/routing";
import { IMPRINT } from "@/lib/site";
import { alternatesFor } from "@/lib/seo";

/*
 * Imprint / Impressum, as § 5 DDG requires of any site run from Germany that
 * is not purely private — a portfolio aimed at clients and employers counts.
 *
 * The personal data lives in lib/site.ts (IMPRINT); the labels live in the
 * messages, so a German version is a translation, not a second page.
 */

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "imprint" });
    return {
        title: t("metaTitle"),
        description: t("metaDescription"),
        alternates: alternatesFor(locale, "/imprint"),
    };
}

function Row({ term, children }: { term: string; children: React.ReactNode }) {
    return (
        <div className="theme-fade grid gap-x-8 gap-y-1.5 border-b border-[var(--page-rule-soft)] py-5 sm:grid-cols-[12rem_minmax(0,1fr)]">
            <dt>
                <Label>{term}</Label>
            </dt>
            <dd className="theme-fade text-[15px] leading-[1.6] text-[var(--page-muted)]">
                {children}
            </dd>
        </div>
    );
}

export default async function ImprintPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "imprint" });

    const address = <LegalAddress />;

    return (
        <ThemedPage>
            <div className="theme-fade pt-32 pb-28 text-[var(--page-fg)]">
                <div className={`flex items-center justify-between gap-6 ${GUTTER}`}>
                    <BackLink href="/" label={t("backHome")} />
                    <PaperInkToggle />
                </div>

                <div className={`mx-auto w-full max-w-[52rem] pt-24 ${GUTTER}`}>
                    <Label>{t("eyebrow")}</Label>
                    <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.04em] hyphens-auto">
                        {t("title")}
                    </h1>

                    <dl className="theme-fade mt-16 border-t border-[var(--page-rule)]">
                        <Row term={t("provider")}>{address}</Row>
                        <Row term={t("contact")}>
                            {t("email")}:{" "}
                            <a
                                href={`mailto:${IMPRINT.email}`}
                                className="hoverable underline underline-offset-4 hover:text-[var(--page-fg)]"
                            >
                                {IMPRINT.email}
                            </a>
                            {IMPRINT.phone && (
                                <>
                                    <br />
                                    {t("phone")}: {IMPRINT.phone}
                                </>
                            )}
                        </Row>
                        {IMPRINT.vatId && <Row term={t("vatId")}>{IMPRINT.vatId}</Row>}
                        <Row term={t("responsible")}>{address}</Row>
                    </dl>
                </div>
            </div>
        </ThemedPage>
    );
}
