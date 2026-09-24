import type { Metadata } from "next";
import { getFormatter, getTranslations } from "next-intl/server";
import ThemedPage from "@/components/ThemedPage";
import LegalAddress from "@/components/layout/LegalAddress";
import PaperInkToggle from "@/components/ui/PaperInkToggle";
import { BackLink, GUTTER, Label } from "@/components/project/kit";
import type { Locale } from "@/i18n/routing";
import { monthDate } from "@/lib/projects";
import { IMPRINT, PRIVACY } from "@/lib/site";
import { alternatesFor } from "@/lib/seo";

/*
 * Privacy policy (Art. 13 GDPR). Short because the site does little: server
 * logs at the host, one localStorage key for the theme, email. If the site ever
 * adds analytics, embeds, a contact form or third-party fonts, this page has to
 * change with it.
 *
 * Same shell and parts as the imprint. Provider details are in lib/site.ts
 * (PRIVACY); the text is in the messages under `privacy`.
 */

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "privacy" });
    return {
        title: t("metaTitle"),
        description: t("metaDescription"),
        alternates: alternatesFor(locale, "/privacy"),
    };
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="theme-fade border-b border-[var(--page-rule-soft)] py-10">
            <h2 className="text-xl leading-tight font-bold tracking-[-0.02em]">{title}</h2>
            <div className="theme-fade mt-4 space-y-4 text-[16px] leading-[1.65] text-[var(--page-muted)]">
                {children}
            </div>
        </section>
    );
}

export default async function PrivacyPage({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "privacy" });
    const format = await getFormatter({ locale });
    const updated = format.dateTime(monthDate(PRIVACY.updated), { month: "long", year: "numeric" });

    return (
        <ThemedPage>
            <div className="theme-fade pt-32 pb-28 text-[var(--page-fg)]">
                <div className={`flex items-center justify-between gap-6 ${GUTTER}`}>
                    <BackLink href="/" label={t("backHome")} />
                    <PaperInkToggle />
                </div>

                <div className={`mx-auto w-full max-w-[52rem] pt-24 ${GUTTER}`}>
                    <Label>{t("eyebrow")}</Label>
                    <h1 className="mt-4 text-[clamp(2.5rem,7vw,5rem)] leading-[0.9] font-bold tracking-[-0.04em]">
                        {t("title")}
                    </h1>
                    <p className="theme-fade mt-10 max-w-[40rem] text-[19px] leading-[1.5] text-[var(--page-fg)] md:text-[21px]">
                        {t("summary")}
                    </p>

                    <div className="mt-14 max-w-[40rem] border-t border-[var(--page-rule)]">
                        <Section title={t("controller.title")}>
                            <p>{t("controller.body")}</p>
                            <LegalAddress />
                            <p>
                                <a
                                    href={`mailto:${IMPRINT.email}`}
                                    className="hoverable underline underline-offset-4 hover:text-[var(--page-fg)]"
                                >
                                    {IMPRINT.email}
                                </a>
                            </p>
                        </Section>

                        <Section title={t("hosting.title")}>
                            <p>{t("hosting.p1", { host: PRIVACY.host })}</p>
                            <p>{t("hosting.p2", { retention: PRIVACY.logRetention })}</p>
                            <p>{t("hosting.p3", { transferBasis: PRIVACY.transferBasis })}</p>
                        </Section>

                        <Section title={t("storage.title")}>
                            <p>{t("storage.p1")}</p>
                            <p>{t("storage.p2")}</p>
                        </Section>

                        <Section title={t("fonts.title")}>
                            <p>{t("fonts.body")}</p>
                        </Section>

                        <Section title={t("email.title")}>
                            <p>{t("email.p1")}</p>
                            <p>{t("email.p2", { emailProvider: PRIVACY.emailProvider })}</p>
                            <p>{t("email.p3")}</p>
                        </Section>

                        <Section title={t("links.title")}>
                            <p>{t("links.body")}</p>
                        </Section>

                        <Section title={t("rights.title")}>
                            <p>{t("rights.p1")}</p>
                            <p>{t("rights.p2")}</p>
                        </Section>

                        <Section title={t("obligation.title")}>
                            <p>{t("obligation.body")}</p>
                        </Section>
                    </div>

                    <p className="mt-10">
                        <Label>{t("updated", { date: updated })}</Label>
                    </p>
                </div>
            </div>
        </ThemedPage>
    );
}
