import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { fileList, resolveFile, defaultFile } from "@/lib/file-registry"
import { locales } from "@/lib/utils"
import metadataJson from "@/data/metadata.json"
import HomeClient from "./home-client"

type Params = Promise<{ lang: string; file?: string[] }>

const DESCRIPTION_MIN = 140
const DESCRIPTION_MAX = 160
const LOCALE_CODE: Record<string, string> = {
  en: "en-US",
  pt: "pt-BR",
}

function clampMetaDescription(content: string): string {
  const normalized = content.replace(/\s+/g, " ").trim()
  if (normalized.length <= DESCRIPTION_MAX) return normalized
  return `${normalized.slice(0, DESCRIPTION_MAX - 1).trimEnd()}.`
}

function buildPageDescription(pageTitle: string, lang: string): string {
  const baseDescription = lang === "pt"
    ? `${pageTitle} no portfolio de ${metadataJson.author.name}. Projetos reais, experiencias tecnicas e foco em performance, SEO e acessibilidade.`
    : `${pageTitle} on ${metadataJson.author.name}'s portfolio. Real projects, technical highlights, and focus on performance, SEO, and accessibility.`

  if (baseDescription.length < DESCRIPTION_MIN) {
    return clampMetaDescription(`${baseDescription} Production ready software engineering with measurable business impact.`)
  }

  return clampMetaDescription(baseDescription)
}

function getPagePath(lang: string, fileId: string): string {
  return fileId === defaultFile ? `/${lang}` : `/${lang}/${fileId}`
}

function buildPageSchema(lang: string, fileId: string, title: string, description: string) {
  const baseUrl = metadataJson.site.url.replace(/\/$/, "")
  const pagePath = getPagePath(lang, fileId)
  const pageUrl = `${baseUrl}${pagePath}`

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
      inLanguage: LOCALE_CODE[lang] ?? LOCALE_CODE.en,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${baseUrl}#website`,
      },
      about: {
        "@type": "Person",
        "@id": `${baseUrl}#person`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: lang === "pt" ? "Inicio" : "Home",
          item: `${baseUrl}/${lang}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: pageUrl,
        },
      ],
    },
  ]
}

export function generateStaticParams() {
  return locales.flatMap((lang) => {
    const rootEntry = [{ lang }]
    const fileEntries = fileList
      .filter((file) => file.id !== defaultFile)
      .map((file) => ({
        lang,
        file: [file.id],
      }))

    return [...rootEntry, ...fileEntries]
  })
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const resolved = await params
  const fileId = resolved.file?.[0] ?? defaultFile
  const lang = resolved.lang
  const entry = resolveFile(fileId)

  if (!entry) return { title: "Not found" }

  const baseUrl = metadataJson.site.url.replace(/\/$/, "")
  const pagePath = getPagePath(lang, fileId)
  const pageTitle = `${entry.title} | ${metadataJson.site.title}`
  const pageDescription = buildPageDescription(entry.title, lang)
  const imageUrl = `${baseUrl}${metadataJson.openGraph.image}`
  const localizedAlternates = Object.fromEntries(
    locales.map((locale) => [locale, `${baseUrl}${getPagePath(locale, fileId)}`]),
  )
  const shouldNoIndex = entry.id === "settings.json"


  return {
    title: pageTitle,
    description: pageDescription,
    keywords: metadataJson.site.keywords,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: `${baseUrl}${pagePath}`,
      siteName: metadataJson.site.title,
      locale: LOCALE_CODE[lang] ?? LOCALE_CODE.en,
      alternateLocale: locales
        .filter((locale) => locale !== lang)
        .map((locale) => LOCALE_CODE[locale] ?? LOCALE_CODE.en),
      type: "website",
      images: [
        {
          url: imageUrl,
          width: metadataJson.openGraph.imageWidth,
          height: metadataJson.openGraph.imageHeight,
          alt: `${entry.title} | ${metadataJson.site.title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}${pagePath}`,
      languages: localizedAlternates,
    },
    robots: {
      index: !shouldNoIndex,
      follow: !shouldNoIndex,
    },
  }
}

export default async function Page({ params }: { params: Params }) {
  const resolved = await params
  const fileId = resolved.file?.[0] ?? defaultFile
  const lang = resolved.lang
  const entry = resolveFile(fileId)

  if (!entry) notFound()

  const pageTitle = `${entry.title} | ${metadataJson.site.title}`
  const pageDescription = buildPageDescription(entry.title, lang)
  const schema = buildPageSchema(lang, fileId, pageTitle, pageDescription)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />
      <HomeClient fileId={entry.id} />
    </>
  )
}
