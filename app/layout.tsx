import type React from "react"
import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { UserProvider } from "@/contexts/UserContext"
import { GoogleAnalytics } from '@next/third-parties/google'
import metadataJson from "@/data/metadata.json"
import "./globals.css"

const geist = localFont({
  src: "../public/fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-primary",
  display: "swap",
  weight: "400 700",
  style: "normal",
})

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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
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
    card: 'summary_large_image',
    title: metadataJson.site.title,
    description: metadataJson.site.description,
    images: [`${metadataJson.site.url}${metadataJson.openGraph.image}`],
  },
  alternates: {
    canonical: metadataJson.site.url,
  },
  other: {
    'theme-color': metadataJson.site.themeColor,
    'msapplication-TileColor': metadataJson.site.themeColor,
  },
}

export const viewport: Viewport = {
  width: metadataJson.viewport.width as "device-width",
  initialScale: metadataJson.viewport.initialScale,
  maximumScale: metadataJson.viewport.maximumScale,
  userScalable: metadataJson.viewport.userScalable,
  themeColor: metadataJson.site.themeColor,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang={metadataJson.site.locale} className="dark scroll-smooth">
      <head>
        <link rel="apple-touch-icon" href="/apple-icon.webp" type="image/webp" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icon-dark-32x32.webp" type="image/webp" media="(prefers-color-scheme: dark)" />
        <link rel="icon" href="/icon-light-32x32.webp" type="image/webp" media="(prefers-color-scheme: light)" />
        <link
          rel="preload"
          href="/og-image.webp"
          as="image"
          type="image/webp"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": `${metadataJson.site.url}#organization`,
              "name": metadataJson.author.name,
              "url": metadataJson.site.url,
              "logo": {
                "@type": "ImageObject",
                "url": `${metadataJson.site.url}${metadataJson.icons.svg}`,
                "width": 800,
                "height": 600
              },
              "description": metadataJson.site.description,
              "foundingDate": "2020",
              "numberOfEmployees": {
                "@type": "QuantitativeValue",
                "value": "1-5"
              },
              "address": {
                "@type": "PostalAddress",
                "addressLocality": metadataJson.author.location,
                "addressRegion": "Brasil",
                "addressCountry": "BR"
              },
              "areaServed": [
                { "@type": "Place", "name": "Brasil" }
              ],
              "serviceType": [
                "Desenvolvimento Web",
                "Design de Interfaces",
                "Consultoria Técnica"
              ]
            })
          }}
        />
      </head>
      <body className={`${geist.className} antialiased dark`}>
        <UserProvider>
          {children}
        </UserProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-3CTJ4REMG8" />
      </body>
    </html>
  )
}
