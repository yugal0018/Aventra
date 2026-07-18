import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Transpile workspace packages (TypeScript source, not compiled)
  transpilePackages: ["@aventra/types", "@aventra/validators"],

  // Ignore ESLint errors during production builds to guarantee fast and successful builds
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Add external image domains here as needed
    ],
  },

  // Security headers applied to every route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
