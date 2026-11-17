import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  // No external Google font fetch at runtime — next/font self-hosts.
  // Keep images local, modern formats save ~30% payload.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  experimental: {
    optimizePackageImports: [],
  }, 
  // Proxy API requests to backend — keeps backend URL private and avoids browser CORS
  async rewrites() {
    const target = (
      process.env.BACKEND_URL ||
      process.env.API_PROXY_TARGET ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://rajharsh11-swarsaarthi-backend.hf.space"
    ).replace(/\/$/, "");

    return [
      {
        source: "/api/:path*",
        destination: `${target}/api/:path*`,
      },
      {
        source: "/backend/:path*",
        destination: `${target}/:path*`,
      },
    ];
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
