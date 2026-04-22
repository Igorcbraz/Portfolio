import type { MetadataRoute } from "next"
import metadata from "@/data/metadata.json"
import { fileList, defaultFile } from "@/lib/file-registry"
import { locales } from "@/lib/utils"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = metadata.site.url.replace(/\/$/, "")
  const lastModified = new Date().toISOString()

  const localizedPages = locales.flatMap((lang) => {
    const rootUrl = `${baseUrl}/${lang}`
    const fileUrls = fileList
      .filter((file) => file.id !== defaultFile)
      .map((file) => ({
        url: `${baseUrl}/${lang}/${file.id}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: file.id === "settings.json" ? 0.4 : 0.6,
      }))

    return [
      {
        url: rootUrl,
        lastModified,
        changeFrequency: "weekly" as const,
        priority: 1,
      },
      ...fileUrls,
    ]
  })

  return [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...localizedPages,
  ]
}
