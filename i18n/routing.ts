import { defineRouting } from "next-intl/routing";

/*
 * The locales the site is served in.
 *
 * To add German or Korean: add "de" / "ko" here, add messages/de.json /
 * messages/ko.json with the same keys as en.json, and the routes, hreflang
 * links, sitemap and <html lang> follow on their own.
 *
 * "as-needed" keeps the default locale unprefixed, so the English URLs are the
 * ones the site has always had (/, /projects) and the others live under /de
 * and /ko.
 */
export const routing = defineRouting({
    locales: ["en"],
    defaultLocale: "en",
    localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
