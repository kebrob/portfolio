"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { EASE_OUT_EXPO } from "@/lib/palette";
import { Label } from "@/components/project/kit";
import { EMAIL, SOCIALS } from "@/lib/site";

/*
 * The contact section, condensed, for the archive and the project pages.
 *
 * Not the home page's full-screen version: a screen of that after every project
 * is a lot, and it is built for the home page's ink. So the same parts —
 * headline, email chip, socials — at section scale, in the --page-* tokens so
 * they turn over with the theme.
 */
export default function ContactCompact() {
    const t = useTranslations("contact");
    const tA11y = useTranslations("a11y");
    const headline = (t.raw("headline") as string[]).join(" ");
    const emailRowRef = useRef(null);
    const emailRowInView = useInView(emailRowRef, { once: true, amount: 0.5 });

    return (
        <div className="px-gutter pt-20 pb-16 md:pt-28 md:pb-20">
            <Label>{t("eyebrow")}</Label>
            <h2 className="mt-6 max-w-[16ch] text-[clamp(2.5rem,8vw,6.5rem)] leading-[0.88] font-bold tracking-tight uppercase">
                {headline}
            </h2>

            <div className="mt-12 flex flex-wrap items-end justify-between gap-x-8 gap-y-10">
                <div ref={emailRowRef} className="flex min-w-0 flex-wrap items-center gap-2">
                    <span className="text-base font-medium tracking-tight uppercase md:text-lg">
                        {t("emailMe")}
                    </span>
                    <motion.span
                        aria-hidden="true"
                        className="hidden h-px bg-current sm:block"
                        initial={{ width: 0 }}
                        animate={emailRowInView ? { width: 80 } : {}}
                        transition={{ duration: 0.6, delay: 0.2, ease: EASE_OUT_EXPO }}
                    />
                    <a
                        href={`mailto:${EMAIL}`}
                        className="hoverable theme-fade group inline-flex items-center gap-1.5 bg-[var(--page-inv)] px-1 py-0.5 font-mono text-sm leading-snug whitespace-nowrap text-[var(--page-inv-fg)] md:text-base"
                    >
                        {EMAIL}
                        <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                </div>

                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                    {SOCIALS.map((s) => (
                        <li key={s.label}>
                            <a
                                href={s.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hoverable theme-fade group inline-flex items-center gap-1 font-mono text-sm tracking-widest text-[var(--page-muted)] uppercase transition-colors hover:text-[var(--page-fg)]"
                            >
                                {s.label}
                                <ArrowUpRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                <span className="sr-only">{tA11y("opensInNewTab")}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
