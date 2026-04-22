"use client"

import type React from "react"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import { UserProvider } from "@/contexts/UserContext"
import { LocaleProvider } from "@/contexts/LocaleContext"
import { VSCodeProvider, useVSCode } from "@/contexts/VSCodeContext"
import metadataJson from "@/data/metadata.json"

const Analytics = dynamic(() => import("@vercel/analytics/next").then((m) => m.Analytics), {
  ssr: false,
  loading: () => null,
})

const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights), {
  ssr: false,
  loading: () => null,
})

const GoogleAnalytics = dynamic(() => import("@next/third-parties/google").then((m) => m.GoogleAnalytics), {
  ssr: false,
  loading: () => null,
})

interface LayoutClientProps {
  children: React.ReactNode
  dictionary: any
  locale: string
}

export default function LayoutClient({ children, dictionary, locale }: LayoutClientProps) {
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false)
  const [isLocalHost, setIsLocalHost] = useState(false)

  useEffect(() => {
    const hostname = window.location.hostname
    setIsLocalHost(hostname === "localhost" || hostname === "127.0.0.1")
  }, [])

  useEffect(() => {
    const enableAnalytics = () => setShouldLoadAnalytics(true)
    const interactionEvents: Array<keyof WindowEventMap> = ["scroll", "pointerdown", "keydown", "touchstart"]

    const idleTimer = window.setTimeout(enableAnalytics, 3500)
    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, enableAnalytics, { once: true, passive: true })
    })

    return () => {
      window.clearTimeout(idleTimer)
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, enableAnalytics)
      })
    }
  }, [])

  return (
    <VSCodeProvider>
      <VSCodeWrapper>
        <LocaleProvider dictionary={dictionary} locale={locale}>
          <UserProvider>
            {children}
          </UserProvider>
        </LocaleProvider>
      </VSCodeWrapper>
      {shouldLoadAnalytics && metadataJson.analytics.vercel && !isLocalHost && (
        <>
          <Analytics />
          <SpeedInsights />
        </>
      )}
      {shouldLoadAnalytics && metadataJson.analytics.googleAnalytics && !isLocalHost && (
        <GoogleAnalytics gaId={metadataJson.analytics.googleAnalytics} />
      )}
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
