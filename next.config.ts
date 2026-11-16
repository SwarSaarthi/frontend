import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // No external Google font fetch at runtime — next/font self-hosts.
  // Keep images local, modern formats save ~30% payload.
  images: {
    qualities: [75, 80, 85],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  experimental: {
    optimizePackageImports: [],
  },
  // Cache static assets (fonts, images) aggressively — reduces repeat fetch
  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff2|ttf)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
