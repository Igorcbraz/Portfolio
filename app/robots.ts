import type { MetadataRoute } from "next"
import metadata from "@/data/metadata.json"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = metadata.site.url.replace(/\/$/, "")

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/", "/admin/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
