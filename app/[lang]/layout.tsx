import type { Metadata, Viewport } from "next"
import type React from "react"
import { getDictionary } from "@/lib/utils"
import { geist, jetBrainsMono } from "@/lib/fonts"
import metadataJson from "@/data/metadata.json"
import LayoutClient from "@/components/layout/layout-client"
import "../globals.css"

const defaultLocale = "en"

export const metadata: Metadata = {
  metadataBase: new URL(metadataJson.site.url),
  title: {
    default: metadataJson.site.title,
    template: "%s | Igor Braz",
  },
  description: metadataJson.site.description,
  keywords: metadataJson.site.keywords,
  authors: [{ name: metadataJson.author.name }],
  creator: metadataJson.author.name,
  publisher: metadataJson.author.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: metadataJson.site.locale,
    url: metadataJson.site.url,
    title: metadataJson.site.title,
    description: metadataJson.site.description,
    images: [
      {
        url: `${metadataJson.site.url}${metadataJson.openGraph.image}`,
        width: metadataJson.openGraph.imageWidth,
        height: metadataJson.openGraph.imageHeight,
        alt: "Imagem principal do portfólio de Igor Braz",
      },
    ],
    siteName: metadataJson.site.title,
  },
  twitter: {
    card: "summary_large_image",
    title: metadataJson.site.title,
    description: metadataJson.site.description,
    images: [`${metadataJson.site.url}${metadataJson.openGraph.image}`],
  },
  alternates: {
    canonical: metadataJson.site.url,
    languages: {
      en: `${metadataJson.site.url}/en`,
      pt: `${metadataJson.site.url}/pt`,
    },
  },
  other: {
    "theme-color": metadataJson.site.themeColor,
    "msapplication-TileColor": metadataJson.site.themeColor,
  },
}

export const viewport: Viewport = {
  width: metadataJson.viewport.width as "device-width",
  initialScale: metadataJson.viewport.initialScale,
  maximumScale: metadataJson.viewport.maximumScale,
  userScalable: metadataJson.viewport.userScalable,
  themeColor: metadataJson.site.themeColor,
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const resolvedParams = await params
  const currentLang = resolvedParams?.lang || defaultLocale
  const dictionary = await getDictionary(currentLang)

  const ldJson = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${metadataJson.site.url}#organization`,
    name: metadataJson.author.name,
    url: metadataJson.site.url,
    logo: {
      "@type": "ImageObject",
      url: `${metadataJson.site.url}${metadataJson.icons.svg}`,
      width: 800,
      height: 600,
    },
    description: metadataJson.site.description,
    foundingDate: "2020",
    numberOfEmployees: {
      "@type": "QuantitativeValue",
      value: "1-5",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: metadataJson.author.location,
      addressRegion: "Brasil",
      addressCountry: "BR",
    },
    areaServed: [{ "@type": "Place", name: "Brasil" }],
    serviceType: [
      "Desenvolvimento Web",
      "Design de Interfaces",
      "Consultoria Técnica",
    ],
  }

  return (
    <html lang={currentLang} className="dark scroll-smooth">
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.webp" type="image/webp" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-dark-32x32.webp" type="image/webp" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/icon-light-32x32.webp" type="image/webp" media="(prefers-color-scheme: light)" />
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ldJson),
          }}
        />
      </head>
      <body className={`${geist.className} ${jetBrainsMono.variable} antialiased dark`}>
        <LayoutClient dictionary={dictionary} locale={currentLang}>
          {children}
        </LayoutClient>
      </body>
    </html>
  )
}
