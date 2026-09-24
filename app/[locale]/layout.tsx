import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";
import "../globals.css";
import Header from "@/components/layout/Header";
import SiteFooter from "@/components/layout/SiteFooter";
import GridBackground from "@/components/GridBackground";
import SmoothScroll from "@/components/SmoothScroll";
import ClientProviders from "@/components/ClientProviders";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
    weight: ["400", "500"],
    subsets: ["latin"],
    variable: "--font-ibm-plex-mono",
});

/*
 * Korean is not served yet. When it is, its font stack is already in
 * globals.css (:lang(ko)); what is missing is a self-hosted Hangul face. Load
 * it here only for `ko` — a next/font call at module scope would put its
 * @font-face rules, with a hundred-odd unicode-range slices, into every
 * locale's stylesheet. See the i18n checklist in the README.
 */

type Props = {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) return {};
    const t = await getTranslations({ locale, namespace: "metadata" });

    return {
        metadataBase: new URL(SITE_URL),
        title: { default: t("title"), template: t("titleTemplate") },
        description: t("description"),
        openGraph: {
            type: "website",
            siteName: t("title"),
            title: t("title"),
            description: t("description"),
            locale: t("ogLocale"),
            url: "/",
        },
        twitter: { card: "summary", title: t("title"), description: t("description") },
    };
}

/*
 * Sets the archive pages' paper/ink theme before first paint.
 *
 * It has to be an inline script in <head>: the choice lives in localStorage,
 * which the server cannot read, so anything that waits for React would render
 * the default first and repaint — a full-page flash from ink to paper on every
 * load for anyone who picked paper. Writing the attribute here means the very
 * first paint is already right, and lib/page-theme.tsx reads this attribute
 * back rather than keeping its own copy.
 *
 * Kept to one expression, and defaulted in the catch, so a browser that refuses
 * localStorage falls through to ink rather than leaving the attribute unset.
 */
const THEME_SCRIPT = `try{document.documentElement.dataset.pageTheme=localStorage.getItem("page-theme")==="light"?"light":"dark"}catch(e){document.documentElement.dataset.pageTheme="dark"}`;

/*
 * Dev only: reload a document the back/forward buttons replayed from the HTTP
 * cache.
 *
 * The Next 16 dev server ties hydration to a per-request debug channel — each
 * document carries its request ID (self.__next_r) and the client waits on the
 * server's stream for that ID before it hydrates. A document replayed from the
 * cache carries an ID the server has already forgotten, so hydration waits
 * forever and the page is inert HTML. A 404 is never eligible for the bfcache,
 * so it always takes this path.
 *
 * A bfcache restore does not re-run scripts, so this only fires on the broken
 * path. Setting Cache-Control: no-store would be the cleaner fix, but Next
 * overwrites that header on rendered pages. Production has no debug channel and
 * hydrates a cached document fine, so none of this ships.
 */
const DEV_CACHE_RELOAD_SCRIPT = `try{var n=performance.getEntriesByType("navigation")[0];if(n&&n.type==="back_forward"&&n.transferSize===0)location.reload()}catch(e){}`;

export default async function RootLayout({ children, params }: Readonly<Props>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    const t = await getTranslations({ locale, namespace: "a11y" });

    return (
        // suppressHydrationWarning is for the data-page-theme THEME_SCRIPT
        // writes: it lands on <html> before React hydrates, so React finds an
        // attribute on this element that its own render did not produce and
        // reports a mismatch. It covers this element only — it does not reach
        // the tree underneath, so a real mismatch in the page still surfaces.
        //
        // The font variables sit on <html> rather than <body> so that
        // --font-sans and --font-mono in the @theme block, which Tailwind emits
        // on :root, can resolve them.
        <html
            lang={locale}
            className={`${inter.variable} ${ibmPlexMono.variable}`}
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
                {process.env.NODE_ENV === "development" && (
                    <script dangerouslySetInnerHTML={{ __html: DEV_CACHE_RELOAD_SCRIPT }} />
                )}
            </head>
            <body className="font-sans">
                <NextIntlClientProvider>
                    <ClientProviders>
                        <a href="#main" className="skip-link">
                            {t("skipToContent")}
                        </a>
                        <SmoothScroll />
                        <GridBackground />
                        <Header />
                        <main id="main" tabIndex={-1}>
                            {children}
                        </main>
                        {/* Resolved at build, like every other date on these static pages. */}
                        <SiteFooter year={new Date().getFullYear()} />
                    </ClientProviders>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
