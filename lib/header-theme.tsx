"use client";

import { createContext, useContext, useState } from "react";

interface HeaderThemeContextValue {
    forceDark: boolean;
    setForceDark: (dark: boolean) => void;
}

const HeaderThemeContext = createContext<HeaderThemeContextValue>({
    forceDark: false,
    setForceDark: () => {},
});

export function HeaderThemeProvider({ children }: { children: React.ReactNode }) {
    const [forceDark, setForceDark] = useState(false);
    return (
        <HeaderThemeContext.Provider value={{ forceDark, setForceDark }}>
            {children}
        </HeaderThemeContext.Provider>
    );
}

export function useHeaderTheme() {
    return useContext(HeaderThemeContext);
}
