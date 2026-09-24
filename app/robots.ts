import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
    return {
        // /lab is local scratch space and never deployed; listed in case it is.
        rules: { userAgent: "*", allow: "/", disallow: "/lab" },
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}
