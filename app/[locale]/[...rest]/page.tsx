import { notFound } from "next/navigation";

// Any path under a locale that matches no route. Calling notFound() here is
// what renders app/[locale]/not-found.tsx — inside the locale's layout, nav and
// theme — instead of Next's bare built-in 404.
export default function CatchAll() {
    notFound();
}
