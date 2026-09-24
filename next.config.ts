import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/*
 * Baseline hardening that costs nothing. No Content-Security-Policy yet: the
 * theme script in the layout is inline, so a CSP needs a hash or nonce for it
 * first (see README).
 */
const SECURITY_HEADERS = [
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
    images: {
        // AVIF first: the portrait is the only raster image, and AVIF is
        // roughly half the bytes of WebP at the same quality.
        formats: ["image/avif", "image/webp"],
        deviceSizes: [320, 640, 768],
        imageSizes: [16, 32, 64, 128, 256, 384],
        qualities: [85],
    },
    async headers() {
        return [{ source: "/:path*", headers: SECURITY_HEADERS }];
    },
};

export default withNextIntl(nextConfig);
