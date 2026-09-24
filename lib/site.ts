/*
 * Facts about the site and its owner that are the same in every language.
 *
 * Proper names, addresses and URLs live here; anything a visitor reads as a
 * sentence or a label lives in messages/<locale>.json. The line is "would a
 * translator change this?" — nobody translates an email address.
 */

/**
 * The canonical origin, used for metadataBase, canonical links, hreflang,
 * the sitemap and structured data. Set NEXT_PUBLIC_SITE_URL in the deployment
 * once the domain is final; the fallback is the best guess so far.
 */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.robertkebinger.com"
).replace(/\/$/, "");

export const AUTHOR = "Robert Kebinger";

export const WORDMARK = "ROBERTKEBINGER";

/** The clock in the nav shows the time here, not the visitor's. */
export const HOME_TIME_ZONE = "Europe/Berlin";

export const EMAIL = "rkebinger@gmail.com";

export const SOCIALS = [
    { label: "GitHub", href: "https://github.com/kebrob" },
    { label: "LinkedIn", href: "https://linkedin.com/in/robert-kebinger-481166204" },
    { label: "Instagram", href: "https://instagram.com/robertkebinger" },
] as const;

/** The first working day. The only input to the years-of-experience count. */
export const CAREER_START = "2019-08-05";

/*
 * The imprint's personal data (§ 5 DDG). Everything else on the imprint page,
 * labels and sentences, is in the messages files under `imprint`.
 *
 * `phone` and `vatId` may be null: the page then omits the line. § 5 DDG wants
 * a second fast contact channel besides email, and without a contact form that
 * is the phone. `vatId` only if you have one.
 */
export const IMPRINT = {
    name: AUTHOR,
    street: "Schullerstraße 13b",
    postalCode: "83026",
    city: "Rosenheim",
    country: "Germany",
    email: EMAIL,
    phone: "+49 1523 1882445" as string | null,
    vatId: null as string | null,
};

/*
 * The privacy policy's provider details. The policy text is in the messages
 * under `privacy`; these are the facts it quotes. If the host or the mailbox
 * changes, these change — and `updated` with them.
 */
export const PRIVACY = {
    /** Who serves the site, with address (from Vercel's privacy policy). */
    host: "Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA",
    /** Runtime log retention on Vercel: 1 hour on Hobby, 1 day on Pro. */
    logRetention: "one day at most",
    /** Vercel Inc. is certified under the DPF. */
    transferBasis:
        "the EU–US Data Privacy Framework (adequacy decision, Art. 45 GDPR), under which Vercel Inc. is certified",
    /** Who handles the mailbox behind the contact address. */
    emailProvider:
        "Google (Gmail), Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Ireland",
    /** "YYYY-MM" — bump whenever the policy changes. */
    updated: "2026-09",
};
