import type { Metadata } from "next";
import ThemedPage from "@/components/ThemedPage";
import ThemeToggleLab from "@/components/lab/ThemeToggleLab";

/*
 * Scratch route for picking the light/dark switch. Nothing links here.
 *
 * Delete this directory and components/lab/ once one of the candidates has been
 * moved into components/ui/PaperInkToggle.tsx.
 */

export const metadata: Metadata = {
    title: "Lab — Light/Dark toggle",
    robots: { index: false, follow: false },
};

export default function ToggleLabPage() {
    return (
        <ThemedPage>
            <ThemeToggleLab />
        </ThemedPage>
    );
}
