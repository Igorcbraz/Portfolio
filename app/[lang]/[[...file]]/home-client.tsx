"use client"

import { useEffect, useState, type ComponentType } from "react"
import dynamic from "next/dynamic"
import { Navigation } from "@/components/layout"
import { IDEStatusBar, IDEBreadcrumb } from "@/components/ide"
import SettingsView from "@/app/(file-views)/settings-view"
import AboutView from "@/app/(file-views)/about-view"
import { useVSCode } from "@/contexts/VSCodeContext"
import { resolveFile } from "@/lib/file-registry"
import { PortfolioContent } from "./portfolio-content"

const CustomCursor = dynamic(() => import("@/components/features/custom-cursor").then(m => m.CustomCursor), {
  ssr: false,
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
      {showStatusBar && (isFileView || !isExpanded) && <IDEStatusBar />}
    </>
  )
}
