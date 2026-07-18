import { MetadataRoute } from "next";

// ============================================================
// ROBOTS — Next.js robots.txt file generator
// Directs search crawler indexing parameters
// ============================================================

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aventra.io";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",      // Protect API route paths from crawling
        "/_next/",    // Exclude build files
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
