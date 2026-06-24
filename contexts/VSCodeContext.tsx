"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import type { VSCodeTheme, VSCodeThemeName } from "@/lib/vscode-themes"
import { defaultTheme, DEFAULT_THEME_NAME, isThemeName, loadThemeByName } from "@/lib/vscode-theme-loader"

interface VSCodeContextType {
  isExpanded: boolean
  setIsExpanded: (expanded: boolean) => void
  activeFile: string
  setActiveFile: (file: string) => void
  theme: VSCodeTheme
  themeName: VSCodeThemeName
  setTheme: (themeName: VSCodeThemeName) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (open: boolean) => void
  activeSidebarTab: string
  setActiveSidebarTab: (tab: string) => void
  isConsoleOpen: boolean
  setIsConsoleOpen: (open: boolean) => void
  openFolders: Record<string, boolean>
  setOpenFolders: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
  toggleFolder: (folderKey: string) => void
  openTabs: string[]
  setOpenTabs: React.Dispatch<React.SetStateAction<string[]>>
}

const VSCodeContext = createContext<VSCodeContextType | undefined>(undefined)

export function VSCodeProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpandedState] = useState(true)
  const [activeFile, setActiveFile] = useState("portfolio.tsx")
  const [themeName, setThemeNameState] = useState<VSCodeThemeName>(DEFAULT_THEME_NAME)
  const [theme, setThemeState] = useState<VSCodeTheme>(defaultTheme)
  const [isSidebarOpen, setIsSidebarOpenState] = useState(true)
  const [activeSidebarTab, setActiveSidebarTabState] = useState("explorer")
  const [isConsoleOpen, setIsConsoleOpen] = useState(false)
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({})
  const [openTabs, setOpenTabs] = useState<string[]>(["portfolio.tsx", "igor.json", "settings.json"])
  const themeRequestIdRef = useRef(0)

  const toggleFolder = (folderKey: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }))
  }

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

    const savedSidebarState = localStorage.getItem("ide-sidebar-open")
    if (savedSidebarState !== null) {
      setIsSidebarOpenState(savedSidebarState === "true")
    }

    const savedSidebarTab = localStorage.getItem("ide-sidebar-tab")
    if (savedSidebarTab !== null) {
      setActiveSidebarTabState(savedSidebarTab)
    }

    const savedTheme = localStorage.getItem("ide-theme")
    if (savedTheme && isThemeName(savedTheme)) {
      applyTheme(savedTheme)
    }

    const savedTabs = localStorage.getItem("ide-open-tabs")
    if (savedTabs) {
      try {
        const parsed = JSON.parse(savedTabs)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setOpenTabs(parsed)
        }
      } catch (e) {
        console.error("Failed to parse open tabs from localStorage", e)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("ide-open-tabs", JSON.stringify(openTabs))
  }, [openTabs])

  const setIsExpanded = (expanded: boolean) => {
    setIsExpandedState(expanded)
    localStorage.setItem("ide-expanded", String(expanded))
  }

  const setIsSidebarOpen = (open: boolean) => {
    setIsSidebarOpenState(open)
    localStorage.setItem("ide-sidebar-open", String(open))
  }

  const setActiveSidebarTab = (tab: string) => {
    setActiveSidebarTabState(tab)
    localStorage.setItem("ide-sidebar-tab", tab)
  }

  const setTheme = (newThemeName: VSCodeThemeName) => {
    applyTheme(newThemeName)
    localStorage.setItem("ide-theme", newThemeName)
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
        isSidebarOpen,
        setIsSidebarOpen,
        activeSidebarTab,
        setActiveSidebarTab,
        isConsoleOpen,
        setIsConsoleOpen,
        openFolders,
        setOpenFolders,
        toggleFolder,
        openTabs,
        setOpenTabs
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
