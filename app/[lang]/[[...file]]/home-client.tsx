"use client"

import { useEffect, useState, type ComponentType } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/layout"
import { useVSCode } from "@/contexts/VSCodeContext"
import { resolveFile } from "@/lib/file-registry"
import { PortfolioContent } from "./portfolio-content"

const IDEBreadcrumb = dynamic(() => import("@/components/ide/ide-breadcrumb").then((m) => m.IDEBreadcrumb), {
  ssr: false,
  loading: () => null,
})

const IDEStatusBar = dynamic(() => import("@/components/ide/ide-status-bar").then((m) => m.IDEStatusBar), {
  ssr: false,
  loading: () => null,
})

const CustomCursor = dynamic(() => import("@/components/features/custom-cursor").then(m => m.CustomCursor), {
  ssr: false,
})

const SettingsView = dynamic(() => import("@/app/(file-views)/settings-view"), {
  loading: () => null,
})

const AboutView = dynamic(() => import("@/app/(file-views)/about-view"), {
  loading: () => null,
})

type HomeClientProps = {
  fileId: string
}

type ComponentKey = "portfolio" | "about" | "settings"

const componentMap: Record<ComponentKey, ComponentType> = {
  portfolio: PortfolioContent,
  about: AboutView,
  settings: SettingsView,
}

export default function HomeClient({ fileId }: HomeClientProps) {
  const entry = resolveFile(fileId)
  const { activeFile, isExpanded, setActiveFile } = useVSCode()
  const [enableCursor, setEnableCursor] = useState(false)
  const [shouldMountStatusBar, setShouldMountStatusBar] = useState(false)

  useEffect(() => {
    if (entry && entry.id !== activeFile) {
      setActiveFile(entry.id)
    }
  }, [entry, activeFile, setActiveFile])

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    if (!media.matches) {
      setEnableCursor(true)
    }
  }, [])

  useEffect(() => {
    if (!entry) return

    if (entry.component !== "portfolio") {
      setShouldMountStatusBar(true)
      return
    }

    let isMounted = true
    const mountStatusBar = () => {
      if (!isMounted) return
      setShouldMountStatusBar(true)
    }

    window.addEventListener("pointerdown", mountStatusBar, { once: true, passive: true })
    window.addEventListener("touchstart", mountStatusBar, { once: true, passive: true })
    window.addEventListener("keydown", mountStatusBar, { once: true })
    window.addEventListener("wheel", mountStatusBar, { once: true, passive: true })

    return () => {
      isMounted = false
      window.removeEventListener("pointerdown", mountStatusBar)
      window.removeEventListener("touchstart", mountStatusBar)
      window.removeEventListener("keydown", mountStatusBar)
      window.removeEventListener("wheel", mountStatusBar)
    }
  }, [entry])

  if (!entry) return null

  const FileComponent = componentMap[entry.component]
  const showNavigation = entry.showNavigation ?? false
  const showStatusBar = entry.showStatusBar ?? true
  const isFileView = entry.component !== "portfolio"

  return (
    <>
      {enableCursor && <CustomCursor />}
      <div className="relative">
        <IDEBreadcrumb />
        <div className={`transition-all duration-700 ease-in-out origin-top ${!isExpanded ? 'pt-[50px]' : 'pt-0'}`}>
          {showNavigation && <Navigation />}
          <FileComponent />
        </div>
      </div>
      {shouldMountStatusBar && showStatusBar && (isFileView || !isExpanded) && <IDEStatusBar />}
    </>
  )
}
