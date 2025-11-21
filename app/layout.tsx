import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { UserProvider } from "@/contexts/UserContext"
import metadataJson from "@/data/metadata.json"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: metadataJson.site.title,
  description: metadataJson.site.description,
  keywords: metadataJson.site.keywords,
  authors: [{ name: metadataJson.author.name }],
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: metadataJson.icons.light,
        media: "(prefers-color-scheme: light)",
      },
      {
        url: metadataJson.icons.dark,
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: metadataJson.icons.svg,
        type: "image/svg+xml",
      },
    ],
    apple: metadataJson.icons.apple,
  },
  openGraph: {
    type: metadataJson.openGraph.type as "website",
    url: metadataJson.site.url,
    title: metadataJson.site.title,
    description: metadataJson.site.description,
    images: [
      {
        url: `${metadataJson.site.url}${metadataJson.openGraph.image}`,
        width: metadataJson.openGraph.imageWidth,
        height: metadataJson.openGraph.imageHeight,
      },
    ],
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
      <body className={`${geist.className} antialiased dark`}>
        <UserProvider>
          {children}
        </UserProvider>
        <Analytics />
      </body>
    </html>
  )
}
