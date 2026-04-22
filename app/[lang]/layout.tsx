import type { Metadata, Viewport } from "next"
import type React from "react"
import { getDictionary } from "@/lib/utils"
import { locales } from "@/lib/locales"
import { geist } from "@/lib/fonts"
import metadataJson from "@/data/metadata.json"
import LayoutClient from "@/components/layout/layout-client"
import "../globals.css"

const defaultLocale = "en"

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

export const metadata: Metadata = {
  metadataBase: new URL(metadataJson.site.url),
  title: {
    default: metadataJson.site.title,
    template: "%s",
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
    canonical: metadataJson.site.url.replace(/\/$/, ""),
    languages: {
      en: `${metadataJson.site.url}/en`,
      pt: `${metadataJson.site.url}/pt`,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-light-32x32.webp", type: "image/webp", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.webp", type: "image/webp", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [{ url: "/apple-icon.webp", type: "image/webp" }],
    shortcut: ["/favicon.svg"],
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
  const baseUrl = metadataJson.site.url.replace(/\/$/, "")
  const inLanguage = currentLang === "pt" ? "pt-BR" : "en-US"

  const ldJson = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}#organization`,
      name: metadataJson.author.name,
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}${metadataJson.icons.svg}`,
        width: 800,
        height: 600,
      },
      description: metadataJson.site.description,
      foundingDate: "2020",
      sameAs: [metadataJson.social.github.url, metadataJson.social.linkedin.url],
      address: {
        "@type": "PostalAddress",
        addressLocality: metadataJson.author.location,
        addressCountry: "BR",
      },
      areaServed: [{ "@type": "Country", name: "Brazil" }],
      serviceType: ["Web Development", "Interface Design", "Technical Consulting"],
    },
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": `${baseUrl}#person`,
      name: metadataJson.author.name,
      url: baseUrl,
      jobTitle: metadataJson.author.role,
      description: metadataJson.author.bio,
      email: metadataJson.author.email,
      homeLocation: {
        "@type": "Place",
        name: metadataJson.author.location,
      },
      sameAs: [metadataJson.social.github.url, metadataJson.social.linkedin.url],
      worksFor: {
        "@id": `${baseUrl}#organization`,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}#website`,
      url: baseUrl,
      name: metadataJson.site.title,
      description: metadataJson.site.description,
      inLanguage,
      publisher: {
        "@id": `${baseUrl}#organization`,
      },
    },
  ]

  return (
    <html lang={currentLang} className="dark scroll-smooth">
      <head>
        <style>{`html,body{min-height:100%;background:#1e1e1e;color:#f5f5f5}#hero{min-height:100svh}`}</style>
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="preconnect" href="https://github.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.linkedin.com" />
        <link rel="preconnect" href="https://www.linkedin.com" crossOrigin="anonymous" />
        <script
          suppressHydrationWarning
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(ldJson),
          }}
        />
      </head>
      <body className={`${geist.className} antialiased dark`}>
        <LayoutClient dictionary={dictionary} locale={currentLang}>
          {children}
        </LayoutClient>
      </body>
    </html>
  )
}
