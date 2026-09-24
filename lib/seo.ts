import type { Metadata } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * Canonical link and hreflang alternates for one page, in every locale the
 * site is served in. `href` is the locale-less path ("/", "/projects").
 *
 * Relative on purpose — metadataBase in the layout turns them into absolute
 * URLs on the configured origin.
 */
export function alternatesFor(locale: Locale, href: string): Metadata["alternates"] {
    const languages: Record<string, string> = {};
    for (const l of routing.locales) languages[l] = getPathname({ locale: l, href });
    languages["x-default"] = getPathname({ locale: routing.defaultLocale, href });

    return { canonical: getPathname({ locale, href }), languages };
}
