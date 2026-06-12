"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  FileCode2,
  FolderOpen,
  GitBranch,
  Search,
  Sidebar as SidebarIcon,
  Minus,
  Square,
  X,
  ChevronRight
} from "lucide-react"
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { defaultFile, fileList } from "@/lib/file-registry"

export function IDETitleBar() {
  const { locale } = useLocale()
  const {
    isExpanded,
    setIsExpanded,
    activeFile,
    theme,
    isSidebarOpen,
    setIsSidebarOpen,
  } = useVSCode()
  const router = useRouter()

  const menuItems = useMemo(() => {
    return locale === "pt"
      ? ["Arquivo", "Editar", "Seleção", "Ver", "Ir", "Terminal", "Ajuda"]
      : ["File", "Edit", "Selection", "View", "Go", "Terminal", "Help"]
  }, [locale])

  if (isExpanded) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-9 flex items-center justify-between px-3 text-xs select-none"
      style={{
        backgroundColor: theme.colors["titleBar.activeBackground"],
        borderBottom: `1px solid ${theme.colors["titleBar.border"] || "rgba(0, 0, 0, 0.15)"}`,
        color: theme.colors["titleBar.activeForeground"]
      }}
    >
      <div className="flex items-center gap-4">

        <div className="flex items-center shrink-0 font-display font-bold text-[15px] tracking-[-0.01em]">
          <span className="text-primary">IB</span>
          <span className="text-muted-foreground">.</span>
        </div>

        <div className="hidden lg:flex items-center gap-2.5 font-sans">
          {menuItems.map((item) => (
            <span
              key={item}
              className="px-2 py-0.5 rounded cursor-pointer transition-colors duration-150"
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex justify-center px-4 max-w-[500px]">
        <div
          className="w-full flex items-center gap-2 rounded px-3 py-1 font-sans cursor-pointer hover:opacity-95 transition-opacity"
          style={{
            backgroundColor: theme.colors["input.background"] || "rgba(0,0,0,0.15)",
            border: `1px solid ${theme.colors["input.border"] || "rgba(255,255,255,0.08)"}`,
            color: theme.colors["input.placeholderForeground"] || theme.colors["titleBar.activeForeground"]
          }}
        >
          <Search className="w-3.5 h-3.5 shrink-0 opacity-60" />
          <span className="text-[11px] truncate select-none">
            portfolio-workspace [Git: main] - {activeFile}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-1 md:border-r md:pr-2.5" style={{ borderColor: theme.colors["titleBar.border"] || "rgba(255,255,255,0.1)" }}>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded cursor-pointer transition-colors"
            style={{
              backgroundColor: isSidebarOpen ? "rgba(255, 255, 255, 0.08)" : "transparent",
              color: isSidebarOpen ? theme.colors["activityBar.activeBorder"] : "inherit"
            }}
            title={isSidebarOpen ? "Esconder Lateral" : "Mostrar Lateral"}
          >
            <SidebarIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3 opacity-70">
          <Minus className="w-3.5 h-3.5 hover:opacity-100 cursor-pointer" onClick={() => setIsExpanded(true)} />
          <Square className="w-3 h-3 hover:opacity-100 cursor-pointer" />
          <X className="w-3.5 h-3.5 hover:opacity-100 cursor-pointer text-red-500" onClick={() => setIsExpanded(true)} />
        </div>
      </div>
    </div>
  )
}

export function IDEEditorHeader() {
  const { locale } = useLocale()
  const {
    isExpanded,
    activeFile,
    setActiveFile,
    theme,
    isSidebarOpen
  } = useVSCode()
  const router = useRouter()

  const tabs = useMemo(
    () => fileList.map((f) => ({ name: f.id, icon: FileCode2, modified: false })),
    []
  )

  const handleTabClick = (fileName: string) => {
    setActiveFile(fileName)
    const href = fileName === defaultFile ? `/${locale}` : `/${locale}/${fileName}`
    router.push(href)
  }

  const activeTabName = activeFile || defaultFile

  if (isExpanded) return null

  return (
    <div
      className={`fixed top-9 right-0 z-35 select-none overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? "left-0 md:left-72" : "left-0 md:left-12"
        }`}
      style={{
        borderBottom: `1px solid ${theme.colors["editorGroup.border"] || "rgba(0, 0, 0, 0.15)"}`
      }}
    >
      <div
        className="flex items-center overflow-x-auto scrollbar-none h-[34px]"
        style={{ backgroundColor: theme.colors["editorGroupHeader.tabsBackground"] }}
      >
        {tabs.map((tab) => {
          const isActive = tab.name === activeTabName
          return (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className="flex items-center gap-2 px-4 h-full text-xs transition-colors min-w-fit border-r font-sans relative cursor-pointer"
              style={{
                backgroundColor: isActive
                  ? theme.colors["tab.activeBackground"]
                  : theme.colors["tab.inactiveBackground"],
                color: isActive
                  ? theme.colors["tab.activeForeground"]
                  : theme.colors["tab.inactiveForeground"],
                borderColor: theme.colors["tab.border"] || "rgba(0, 0, 0, 0.1)"
              }}
            >
              {isActive && theme.colors["tab.activeBorderTop"] && (
                <div
                  className="absolute top-0 left-0 right-0 h-[2.5px]"
                  style={{ backgroundColor: theme.colors["tab.activeBorderTop"] }}
                />
              )}
              {isActive && !theme.colors["tab.activeBorderTop"] && theme.colors["tab.activeBorder"] && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2.5px]"
                  style={{ backgroundColor: theme.colors["tab.activeBorder"] }}
                />
              )}

              <tab.icon className="w-3.5 h-3.5 text-cyan-400" />
              <span>{tab.name}</span>

              <span
                className="ml-1 p-0.5 rounded-sm opacity-50 hover:opacity-100 hover:bg-white/10"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <X className="w-2.5 h-2.5" />
              </span>
            </button>
          )
        })}
      </div>

      <div
        className="h-[22px] flex items-center px-4 text-[11px] font-sans gap-1.5"
        style={{
          backgroundColor: theme.colors["editor.background"],
          color: theme.colors["tab.inactiveForeground"]
        }}
      >
        <FolderOpen className="w-3.5 h-3.5 opacity-70" />
        <span className="opacity-75">portfolio-workspace</span>
        <ChevronRight className="w-3 h-3 opacity-50" />
        <GitBranch className="w-3.5 h-3.5 opacity-70 text-blue-400" />
        <span className="opacity-75">main</span>
        <ChevronRight className="w-3 h-3 opacity-50" />
        <FileCode2 className="w-3.5 h-3.5 opacity-70 text-cyan-400" />
        <span
          className="font-semibold"
          style={{ color: theme.tokenColors.class || theme.colors["tab.activeForeground"] }}
        >
          {activeFile}
        </span>
      </div>
    </div>
  )
}
