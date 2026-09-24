import ThemedPage from "@/components/ThemedPage";
import { NotFoundCat } from "@/components/not-found/designs";

/*
 * The 404, wrapped in the same themed shell as the archive and the project
 * pages — so the paper/ink toggle works here, the nav picks up the right
 * colour, and arriving at a dead URL does not also mean arriving at a page that
 * looks like it belongs to a different site.
 *
 * Which of the four candidates ships is the import above. See
 * components/not-found/designs.tsx for the other three and /lab/404 to compare
 * them side by side; delete the losers once the choice has settled.
 */
export default function NotFound() {
    return (
        <ThemedPage>
            <NotFoundCat />
        </ThemedPage>
    );
}
