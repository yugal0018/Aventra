import { MetadataRoute } from "next";

// ============================================================
// SITEMAP — dynamic Next.js sitemap generator
// Generates sitemap.xml for search engine indexing
// ============================================================

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aventra.io";

  // Base marketing routes
  const routes = [
    "",
    "/about",
    "/features",
    "/pricing",
    "/contact",
    "/signup",
    "/login",
    "/blog",
    "/roadmap",
    "/changelog",
    "/careers",
    "/privacy",
    "/terms",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : route === "/signup" ? 0.9 : 0.7,
  }));

  // Dynamic blog articles
  const blogSlugs = [
    "re-architecting-modern-hiring",
    "importance-of-verified-credentials",
    "coordinating-placements-in-one-shared-database",
  ];

  const blogRoutes = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...routes, ...blogRoutes];
}
