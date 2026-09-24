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

export const EMAIL = "hello@robertkebinger.com";

export const SOCIALS = [
    { label: "GitHub", href: "https://github.com/kebrob" },
    { label: "LinkedIn", href: "https://linkedin.com/in/robert-kebinger-481166204" },
    { label: "Instagram", href: "https://instagram.com/robertkebinger" },
] as const;

/** The first working day. The only input to the years-of-experience count. */
export const CAREER_START = "2019-08-05";

/*
 * The imprint's personal data (§ 5 DDG). Deliberately placeholders — fill
 * these in before going live. Everything else on the imprint page, labels and
 * sentences, is in the messages files under `imprint`.
 *
 * `phone` and `vatId` may be left null: the page then omits the line. A second
 * fast contact channel besides email is expected, so keep `phone` unless there
 * is another one (e.g. a contact form). `vatId` only if you have one.
 */
export const IMPRINT = {
    name: "[NAME]",
    street: "[STREET AND NUMBER]",
    postalCode: "[POSTAL CODE]",
    city: "[CITY]",
    country: "[COUNTRY]",
    email: "[EMAIL]",
    phone: "[PHONE]" as string | null,
    vatId: null as string | null,
};

/*
 * The privacy policy's provider details. Placeholders like the imprint's —
 * fill in before going live. The policy text is in the messages under
 * `privacy`; these are the facts it quotes.
 */
export const PRIVACY = {
    /** Who serves the site, with address — e.g. "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA". */
    host: "[HOSTING PROVIDER, NAME AND ADDRESS]",
    /** How long the host keeps access logs — check its documentation. */
    logRetention: "[LOG RETENTION PERIOD]",
    /** Legal basis for transfers outside the EU/EEA, if the host is outside it. */
    transferBasis: "[TRANSFER BASIS, E.G. THE EU–US DATA PRIVACY FRAMEWORK]",
    /** Who handles the mailbox behind the contact address. */
    emailProvider: "[EMAIL PROVIDER]",
    /** "YYYY-MM" — bump whenever the policy changes. */
    updated: "2026-09",
};
