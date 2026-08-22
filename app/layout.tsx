import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import GridBackground from "@/components/GridBackground";
import SmoothScroll from "@/components/SmoothScroll";
import ClientProviders from "@/components/ClientProviders";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
    weight: ["400", "500"],
    subsets: ["latin"],
    variable: "--font-ibm-plex-mono",
});

export const metadata: Metadata = {
    title: "Robert Kebinger | Frontend Developer",
    description: "Frontend Developer crafting clean, purposeful digital experiences",
};

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        // suppressHydrationWarning is for the data-page-theme THEME_SCRIPT
        // writes: it lands on <html> before React hydrates, so React finds an
        // attribute on this element that its own render did not produce and
        // reports a mismatch. It covers this element only — it does not reach
        // the tree underneath, so a real mismatch in the page still surfaces.
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
            </head>
            <body className={`${inter.variable} ${ibmPlexMono.variable} font-sans`}>
                <ClientProviders>
                    <SmoothScroll />
                    <GridBackground />
                    <Header />
                    <main>{children}</main>
                </ClientProviders>
            </body>
        </html>
    );
}
