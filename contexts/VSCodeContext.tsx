"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import type { VSCodeTheme, VSCodeThemeName } from "@/lib/vscode-themes"
import { type CursorConfig, type CursorPreset, type AccentColor, defaultCursorConfig } from "@/lib/cursor-styles"
import { defaultTheme, DEFAULT_THEME_NAME, isThemeName, loadThemeByName } from "@/lib/vscode-theme-loader"

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
  const [themeName, setThemeNameState] = useState<VSCodeThemeName>(DEFAULT_THEME_NAME)
  const [theme, setThemeState] = useState<VSCodeTheme>(defaultTheme)
  const [cursorConfig, setCursorConfigState] = useState<CursorConfig>(defaultCursorConfig)
  const themeRequestIdRef = useRef(0)

  const applyTheme = (nextThemeName: VSCodeThemeName) => {
    setThemeNameState(nextThemeName)
    const requestId = themeRequestIdRef.current + 1
    themeRequestIdRef.current = requestId

    void loadThemeByName(nextThemeName)
      .then((nextTheme) => {
        if (themeRequestIdRef.current === requestId) {
          setThemeState(nextTheme)
        }
      })
      .catch((error) => {
        console.error("Failed to load VSCode theme", error)
        if (themeRequestIdRef.current === requestId) {
          setThemeState(defaultTheme)
          setThemeNameState(DEFAULT_THEME_NAME)
        }
      })
  }

  useEffect(() => {
    const savedState = localStorage.getItem("ide-expanded")
    if (savedState !== null) {
      setIsExpandedState(savedState === "true")
    }

    const savedTheme = localStorage.getItem("ide-theme")
    if (savedTheme && isThemeName(savedTheme)) {
      applyTheme(savedTheme)
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
    localStorage.setItem("ide-expanded", String(expanded))
  }

  const setTheme = (newThemeName: VSCodeThemeName) => {
    applyTheme(newThemeName)
    localStorage.setItem("ide-theme", newThemeName)
  }

  const setCursorPreset = (preset: CursorPreset) => {
    const newConfig = { ...cursorConfig, preset }
    setCursorConfigState(newConfig)
    localStorage.setItem("cursor-config", JSON.stringify(newConfig))
  }

  const setCursorColor = (color: AccentColor) => {
    const newConfig = { ...cursorConfig, color }
    setCursorConfigState(newConfig)
    localStorage.setItem("cursor-config", JSON.stringify(newConfig))
  }

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
