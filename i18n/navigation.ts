import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/*
 * Locale-aware stand-ins for next/link and next/navigation. Import Link,
 * useRouter and usePathname from here, never from next/*: these keep the
 * visitor's locale prefix on every internal link, and usePathname returns the
 * path without it, so `pathname === "/"` means "home" in every language.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
