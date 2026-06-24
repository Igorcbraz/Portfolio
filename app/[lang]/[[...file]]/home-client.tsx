"use client"

import { useEffect, useState, type ComponentType } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/layout"
import { useVSCode } from "@/contexts/VSCodeContext"
import { resolveFile } from "@/lib/file-registry"
import { PortfolioContent } from "./portfolio-content"

const IDETitleBar = dynamic(() => import("@/components/ide/ide-breadcrumb").then((m) => m.IDETitleBar), {
  ssr: false,
  loading: () => null,
})

const IDEEditorHeader = dynamic(() => import("@/components/ide/ide-breadcrumb").then((m) => m.IDEEditorHeader), {
  ssr: false,
  loading: () => null,
})

const IDESidebar = dynamic(() => import("@/components/ide/ide-sidebar").then((m) => m.IDESidebar), {
  ssr: false,
  loading: () => null,
})

const IDEStatusBar = dynamic(() => import("@/components/ide/ide-status-bar").then((m) => m.IDEStatusBar), {
  ssr: false,
  loading: () => null,
})

const SettingsView = dynamic(() => import("@/app/(file-views)/settings-view"), {
  loading: () => null,
})

const AboutView = dynamic(() => import("@/app/(file-views)/about-view"), {
  loading: () => null,
})

const CodeView = dynamic(() => import("@/app/(file-views)/code-view"), {
  loading: () => null,
})

type HomeClientProps = {
  fileId: string
}

type ComponentKey = "portfolio" | "about" | "settings" | "code"

const componentMap: Record<ComponentKey, ComponentType> = {
  portfolio: PortfolioContent,
  about: AboutView,
  settings: SettingsView,
  code: CodeView,
}

export default function HomeClient({ fileId }: HomeClientProps) {
  const entry = resolveFile(fileId)
  const { activeFile, isExpanded, setActiveFile, isSidebarOpen, openTabs, setOpenTabs } = useVSCode()
  const [shouldMountStatusBar, setShouldMountStatusBar] = useState(false)

  useEffect(() => {
    if (entry) {
      setActiveFile(entry.id)
      setOpenTabs((prev) => {
        if (!prev.includes(entry.id)) {
          return [...prev, entry.id]
        }
        return prev
      })
    }
  }, [fileId, setActiveFile, setOpenTabs])

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
      <div className="relative w-full min-h-screen">
        <IDETitleBar />
        <IDESidebar />
        <IDEEditorHeader />
        <div
          className={`transition-[padding] duration-500 ease-in-out ${!isExpanded
              ? `pt-[92px] ${isSidebarOpen ? 'pl-0 md:pl-72' : 'pl-0 md:pl-12'}`
              : 'pt-0 pl-0'
            }`}
        >
          {showNavigation && <Navigation />}
          <FileComponent />
        </div>
      </div>
      {shouldMountStatusBar && showStatusBar && (isFileView || !isExpanded) && <IDEStatusBar />}
    </>
  )
}
