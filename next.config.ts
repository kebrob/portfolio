import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        deviceSizes: [320, 640, 768],
        imageSizes: [16, 32, 64, 128, 256, 384],
        qualities: [85],
    },
};

export default nextConfig;
