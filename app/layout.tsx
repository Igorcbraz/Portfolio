import type React from "react"
import { headers } from "next/headers"
import { geist } from "@/lib/fonts"
import { locales, defaultLocale } from "@/proxy"
import "./globals.css"

function getLocaleFromHeader(acceptLanguageHeader?: string | null) {
  if (!acceptLanguageHeader) return defaultLocale
  const preferredLanguages = acceptLanguageHeader
    .split(',')
    .map(lang => lang.split(';')[0].trim())
  for (const lang of preferredLanguages) {
    const base = lang.split('-')[0]
    if (locales.includes(base)) return base
  }
  return defaultLocale
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers()
  const acceptLanguageHeader = headersList.get('accept-language')
  const currentLang = getLocaleFromHeader(acceptLanguageHeader)

  return (
    <html lang={currentLang} className="dark scroll-smooth">
      <body className={`${geist.className} antialiased dark`}>
        {children}
      </body>
    </html>
  )
}
