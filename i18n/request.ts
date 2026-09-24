import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/*
 * The locale comes from the [locale] root segment via next/root-params, which
 * is what keeps every page statically rendered without a setRequestLocale()
 * call in each of them.
 *
 * An unknown locale falls back to the default here rather than calling
 * notFound(): the layout already rejects unknown locales, and the 404 itself
 * is rendered in a context where the root param can be unset — a notFound()
 * thrown from in here then escapes the not-found boundary and Next serves a
 * bare error shell with no <head> script and no theme.
 */
export default getRequestConfig(async () => {
    const requested = await rootParams.locale();
    const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
        // Pinned so dates format the same at build and in the browser; an
        // unset time zone is a hydration mismatch waiting for a visitor on the
        // other side of midnight.
        timeZone: "Europe/Berlin",
    };
});
