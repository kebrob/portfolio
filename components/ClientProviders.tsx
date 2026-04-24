"use client";

import CustomCursor from "@/components/CustomCursor";
import { HeaderThemeProvider } from "@/lib/header-theme";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
    return (
        <HeaderThemeProvider>
            <CustomCursor />
            {children}
        </HeaderThemeProvider>
    );
}
