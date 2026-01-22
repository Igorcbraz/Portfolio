"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { FileCode2, FolderOpen, GitBranch, Search } from "lucide-react"
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { defaultFile, fileList } from "@/lib/file-registry"

export function IDEBreadcrumb() {
  const { locale } = useLocale()
  const { isExpanded, activeFile, setActiveFile, theme } = useVSCode()
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

  return (
    <div
      className={`${isExpanded ? 'sticky' : 'fixed'} top-0 left-0 right-0 z-50 select-none overflow-hidden transition-all duration-700 ease-in-out ${isExpanded ? 'max-h-0 opacity-0 -translate-y-full pointer-events-none' : 'max-h-[200px] opacity-100 translate-y-0 rounded-t-xl pointer-events-auto'}`}
      style={{
        backgroundColor: theme.colors["titleBar.activeBackground"],
        borderBottom: `1px solid ${theme.colors["titleBar.border"]}`,
      }}
    >
      <div
        className="h-9 flex items-center justify-between px-4 text-xs"
        style={{ color: theme.colors["titleBar.activeForeground"] }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1.5"
            style={{ color: theme.colors["titleBar.inactiveForeground"] }}
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>portfolio-workspace</span>
          </div>

          <span style={{ color: theme.colors["titleBar.inactiveForeground"] }}>/</span>

          <div className="flex items-center gap-1.5">
            <GitBranch
              className="w-3.5 h-3.5"
              style={{ color: theme.colors["statusBar.background"] }}
            />
            <span style={{ color: theme.colors["titleBar.activeForeground"] }}>main</span>
          </div>

          <span style={{ color: theme.colors["titleBar.inactiveForeground"] }}>/</span>

          <div className="flex items-center gap-1.5 transition-all duration-300">
            <FileCode2
              className="w-3.5 h-3.5"
              style={{ color: theme.tokenColors.class }}
            />
            <span
              className="font-semibold transition-all duration-300"
              style={{ color: theme.tokenColors.class }}
            >
              {activeFile}
            </span>
          </div>
        </div>

        <div
          className="hidden md:flex items-center gap-2 rounded px-3 py-1 hover:opacity-80 transition-opacity cursor-pointer"
          style={{
            backgroundColor: theme.colors["input.background"],
            border: `1px solid ${theme.colors["input.border"]}`,
            color: theme.colors["input.placeholderForeground"]
          }}
        >
          <Search className="w-3 h-3" />
          <span className="text-[10px]">Buscar (Ctrl+P)</span>
        </div>
      </div>

      <div
        className="flex items-center overflow-x-auto scrollbar-none"
        style={{ backgroundColor: theme.colors["editorGroupHeader.tabsBackground"] }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.name)}
            className="flex items-center gap-2 px-4 py-2 text-xs transition-colors min-w-fit"
            style={{
              backgroundColor: tab.name === activeTabName
                ? theme.colors["tab.activeBackground"]
                : theme.colors["tab.inactiveBackground"],
              color: tab.name === activeTabName
                ? theme.colors["tab.activeForeground"]
                : theme.colors["tab.inactiveForeground"],
              borderRight: `1px solid ${theme.colors["tab.border"]}`,
              borderTop: tab.name === activeTabName
                ? `2px solid ${theme.colors["tab.activeBorderTop"]}`
                : 'none',
            }}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.name}</span>
            {tab.modified && (
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: theme.colors["statusBar.background"] }}
              ></div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
