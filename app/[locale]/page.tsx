import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import ProjectsTransition from "@/components/sections/ProjectsTransition";
import HashScroll from "@/components/HashScroll";
import type { Locale } from "@/i18n/routing";
import { AUTHOR, CAREER_START, SITE_URL, SOCIALS } from "@/lib/site";
import { alternatesFor } from "@/lib/seo";

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    return { alternates: alternatesFor(locale, "/") };
}

/*
 * Date-dependent values are resolved here, in a server component, rather than
 * inside the client section that shows them (the footer's year likewise, in the
 * layout). Computed in a client component, the prerendered value and the
 * hydration render disagree after an anniversary and React repaints the number.
 * Here it is computed once, at build, and goes stale only until the next
 * deploy, like every other word on this static page.
 */
export default async function Home({ params }: Props) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "metadata" });

    const now = new Date();
    const yearsOfExperience = Math.floor(
        (now.getTime() - new Date(CAREER_START).getTime()) / MS_PER_YEAR
    );

    const personJsonLd = {
        "@context": "https://schema.org",
        "@type": "Person",
        name: AUTHOR,
        url: SITE_URL,
        jobTitle: t("jobTitle"),
        address: {
            "@type": "PostalAddress",
            addressLocality: "Rosenheim",
            addressCountry: "DE",
        },
        sameAs: SOCIALS.map((s) => s.href),
    };

    return (
        <>
            <script
                type="application/ld+json"
                // Escaped so a "</script>" in any value cannot end the tag.
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
                }}
            />
            {/* Arrivals from the nav on another page — /#about and friends */}
            <HashScroll />
            <Hero />
            <About yearsOfExperience={yearsOfExperience} />
            <Experience />
            <ProjectsTransition />
            {/* The contact section follows as the site footer, from the layout. */}
        </>
    );
}
