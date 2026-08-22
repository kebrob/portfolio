"use client";

import CustomCursor from "@/components/CustomCursor";
import { HeaderThemeProvider } from "@/lib/header-theme";
import { PageThemeProvider } from "@/lib/page-theme";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <HeaderThemeProvider>
            <PageThemeProvider>
                <CustomCursor />
                {children}
            </PageThemeProvider>
        </HeaderThemeProvider>
    );
}
