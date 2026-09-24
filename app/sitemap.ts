import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { PROJECT_SLUGS } from "@/lib/projects";
import { SITE_URL } from "@/lib/site";

const PAGES = [
    "/",
    "/projects",
    ...PROJECT_SLUGS.map((slug) => `/project/${slug}`),
    "/imprint",
    "/privacy",
];

/*
 * One entry per page, listing every locale's URL as an alternate, so search
 * engines get the hreflang cluster from the sitemap as well as from <head>.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const url = (locale: Locale, href: string) => SITE_URL + getPathname({ locale, href });

    return PAGES.map((href) => ({
        url: url(routing.defaultLocale, href),
        alternates: {
            languages: Object.fromEntries(routing.locales.map((l) => [l, url(l, href)])),
        },
    }));
}
