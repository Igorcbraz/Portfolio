"use client"

import type React from "react"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { UserProvider } from "@/contexts/UserContext"
import { LocaleProvider } from "@/contexts/LocaleContext"
import { VSCodeProvider, useVSCode } from "@/contexts/VSCodeContext"

interface LayoutClientProps {
  children: React.ReactNode
  dictionary: any
  locale: string
}

export default function LayoutClient({ children, dictionary, locale }: LayoutClientProps) {
  return (
    <VSCodeProvider>
      <VSCodeWrapper>
        <LocaleProvider dictionary={dictionary} locale={locale}>
          <UserProvider>
            {children}
          </UserProvider>
        </LocaleProvider>
      </VSCodeWrapper>
      <Analytics />
      <SpeedInsights />
      <GoogleAnalytics gaId="G-3CTJ4REMG8" />
    </VSCodeProvider>
  )
}

function VSCodeWrapper({ children }: { children: React.ReactNode }) {
  const { isExpanded, theme } = useVSCode()

  return (
    <div
      className="min-h-screen transition-all duration-500 p-0"
      style={{
        backgroundColor: isExpanded ? undefined : theme.colors["editor.background"]
      }}
    >
      <div
        className="mx-auto max-w-[1920px] overflow-hidden transition-all duration-500"
        style={{
          backgroundColor: theme.colors["editor.background"],
          borderRadius: isExpanded ? 0 : '0.75rem',
          boxShadow: isExpanded ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: isExpanded ? 'none' : `1px solid ${theme.colors["editorGroup.border"]}`
        }}
      >
        {children}
      </div>
    </div>
  )
}
