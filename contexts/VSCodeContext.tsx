"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { type VSCodeTheme, type VSCodeThemeName, vscodeThemes } from "@/lib/vscode-themes"
import { type CursorConfig, type CursorPreset, type AccentColor, defaultCursorConfig } from "@/lib/cursor-styles"

interface VSCodeContextType {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  activeFile: string
  setActiveFile: (file: string) => void
  theme: VSCodeTheme
  themeName: VSCodeThemeName
  setTheme: (themeName: VSCodeThemeName) => void
  cursorConfig: CursorConfig
  setCursorPreset: (preset: CursorPreset) => void
  setCursorColor: (color: AccentColor) => void
}

const VSCodeContext = createContext<VSCodeContextType | undefined>(undefined)

export function VSCodeProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpandedState] = useState(true)
  const [activeFile, setActiveFile] = useState("portfolio.tsx")
  const [themeName, setThemeNameState] = useState<VSCodeThemeName>("beardedThemeSurprisingBlueberry")
  const [cursorConfig, setCursorConfigState] = useState<CursorConfig>(defaultCursorConfig)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const savedState = localStorage.getItem("ide-expanded")
    if (savedState !== null) {
      setIsExpandedState(savedState === "true")
    }

    const savedTheme = localStorage.getItem("ide-theme") as VSCodeThemeName
    if (savedTheme && vscodeThemes[savedTheme]) {
      setThemeNameState(savedTheme)
    }

    const savedCursor = localStorage.getItem("cursor-config")
    if (savedCursor) {
      try {
        setCursorConfigState(JSON.parse(savedCursor))
      } catch (e) {
        console.error("Failed to parse cursor config", e)
      }
    }
  }, [])

  const setIsExpanded = (expanded: boolean) => {
    setIsExpandedState(expanded)
    if (isClient) {
      localStorage.setItem("ide-expanded", String(expanded))
    }
  }

  const setTheme = (newThemeName: VSCodeThemeName) => {
    setThemeNameState(newThemeName)
    if (isClient) {
      localStorage.setItem("ide-theme", newThemeName)
    }
  }

  const setCursorPreset = (preset: CursorPreset) => {
    const newConfig = { ...cursorConfig, preset }
    setCursorConfigState(newConfig)
    if (isClient) {
      localStorage.setItem("cursor-config", JSON.stringify(newConfig))
    }
  }

  const setCursorColor = (color: AccentColor) => {
    const newConfig = { ...cursorConfig, color }
    setCursorConfigState(newConfig)
    if (isClient) {
      localStorage.setItem("cursor-config", JSON.stringify(newConfig))
    }
  }

  const theme = vscodeThemes[themeName]

  return (
    <VSCodeContext.Provider
      value={{
        isExpanded,
        setIsExpanded,
        activeFile,
        setActiveFile,
        theme,
        themeName,
        setTheme,
        cursorConfig,
        setCursorPreset,
        setCursorColor
      }}
    >
      {children}
    </VSCodeContext.Provider>
  )
}

export function useVSCode() {
  const context = useContext(VSCodeContext)
  if (!context) {
    throw new Error("useVSCode must be used within VSCodeProvider")
  }
  return context
}
