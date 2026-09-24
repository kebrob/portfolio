"use client";

import { MotionConfig } from "framer-motion";
import CustomCursor from "@/components/CustomCursor";
import { HeaderThemeProvider } from "@/lib/header-theme";
import { PageThemeProvider } from "@/lib/page-theme";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        // reducedMotion="user": for visitors who ask for less motion, framer
        // drops transform animations (the slide-ups, the word stagger) and
        // keeps the opacity fades, so nothing arrives with a lurch. Everyone
        // else sees no difference. Scroll-linked values set through `style`
        // are not animations and are handled where they are used.
        <MotionConfig reducedMotion="user">
            <HeaderThemeProvider>
                <PageThemeProvider>
                    <CustomCursor />
                    {children}
                </PageThemeProvider>
            </HeaderThemeProvider>
        </MotionConfig>
    );
}
