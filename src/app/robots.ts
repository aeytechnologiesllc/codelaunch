import type { MetadataRoute } from "next";

const SITE_URL = "https://codelynch.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep auth-gated + admin sections out of search results
        disallow: ["/dashboard", "/dashboard/", "/admin", "/admin/", "/portal", "/portal/", "/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
