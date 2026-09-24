"use client";

import Contact from "@/components/sections/Contact";
import ContactCompact from "@/components/layout/ContactCompact";
import LegalLinks from "@/components/layout/LegalLinks";
import { usePathname } from "@/i18n/navigation";
import { PROJECT_SLUGS } from "@/lib/projects";

/** Pages that end on the compact contact block: the archive and every real project. */
const PROJECT_PATHS = new Set(["/projects", ...PROJECT_SLUGS.map((slug) => `/project/${slug}`)]);

/*
 * The site footer, rendered once by the layout — after <main>, not inside it,
 * which is what makes it the page's footer landmark for assistive tech. (A
 * <footer> inside <main> is just a footer of the main content.)
 *
 * Which footer depends on the page:
 *   - home: the full contact section, which is the last scene of that page;
 *   - archive and project pages: the compact contact block, then the legal line;
 *   - everything else — imprint, privacy, the 404: just the legal line.
 *
 * Decided by path rather than by each page, because a page cannot render
 * outside <main>. The project check is against the real slugs, so a 404 under
 * /project/ gets the plain footer like any other 404.
 *
 * `year` comes from the (server) layout, so it is fixed at build like the rest
 * of the prerendered page and cannot disagree with it at hydration.
 */
export default function SiteFooter({ year }: { year: number }) {
    const pathname = usePathname();

    if (pathname === "/") return <Contact year={year} />;

    return (
        <footer className="theme-fade border-t border-[var(--page-rule)] text-[var(--page-fg)]">
            {PROJECT_PATHS.has(pathname) && <ContactCompact />}
            <LegalLinks
                year={year}
                className={`theme-fade px-gutter py-8 text-[var(--page-muted)] [&_a:hover]:text-[var(--page-fg)] ${
                    PROJECT_PATHS.has(pathname) ? "border-t border-[var(--page-rule-soft)]" : ""
                }`}
            />
        </footer>
    );
}
