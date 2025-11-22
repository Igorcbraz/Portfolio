import type React from "react"
import localFont from "next/font/local"
import { headers } from "next/headers"
import { locales, defaultLocale } from "@/proxy"
import "./globals.css"

const geist = localFont({
  src: "../public/fonts/Geist-VariableFont_wght.ttf",
  variable: "--font-primary",
  display: "swap",
  weight: "400 700",
  style: "normal",
})

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
