"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { defaultFile } from "@/lib/file-registry"
import {
  Files,
  Search as SearchIcon,
  GitBranch,
  Blocks,
  User,
  Settings as SettingsIcon,
  Folder,
  FolderOpen,
  FileCode2,
  ChevronDown,
  ChevronRight,
  Check,
  Loader2,
  GitCommit,
  MoreHorizontal
} from "lucide-react"

import aboutEn from "@/locales/about/en.json"
import aboutPt from "@/locales/about/pt.json"
import settingsData from "@/data/settings.json"

export function IDESidebar() {
  const { locale, dictionary } = useLocale()
  const {
    isExpanded,
    activeFile,
    setActiveFile,
    theme,
    isSidebarOpen,
    setIsSidebarOpen,
    activeSidebarTab,
    setActiveSidebarTab
  } = useVSCode()
  const router = useRouter()

  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    components: false,
    data: true,
    dataAbout: false,
    config: false
  })

  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Array<{ file: string; line: number; content: string }>>([])

  const [commitMessage, setCommitMessage] = useState("")
  const [gitStatus, setGitStatus] = useState<"idle" | "committing" | "success">("idle")
  const [hasChanges, setHasChanges] = useState(true)

  const toggleFolder = (folderKey: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [folderKey]: !prev[folderKey]
    }))
  }

  const handleFileClick = (fileName: string) => {
    setActiveFile(fileName)
    const href = fileName === defaultFile ? `/${locale}` : `/${locale}/${fileName}`
    router.push(href)
  }

  const tabs = [
    { id: "explorer", icon: Files, label: "Explorer (Ctrl+Shift+E)" },
    { id: "search", icon: SearchIcon, label: "Search (Ctrl+Shift+F)" },
    { id: "git", icon: GitBranch, label: "Source Control (Ctrl+Shift+G)", badge: hasChanges ? "1" : null },
    { id: "extensions", icon: Blocks, label: "Extensions (Ctrl+Shift+X)" }
  ]

  const handleTabClick = (tabId: string) => {
    if (activeSidebarTab === tabId && isSidebarOpen) {
      setIsSidebarOpen(false)
    } else {
      setActiveSidebarTab(tabId)
      setIsSidebarOpen(true)
    }
  }

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    const query = searchQuery.toLowerCase()
    const results: typeof searchResults = []

    const aboutData = locale === "pt" ? aboutPt : aboutEn
    const aboutStr = JSON.stringify(aboutData, null, 2)
    const aboutLines = aboutStr.split("\n")
    aboutLines.forEach((line, index) => {
      if (line.toLowerCase().includes(query)) {
        results.push({
          file: "igor.json",
          line: index + 1,
          content: line.trim()
        })
      }
    })

    const settingsStr = JSON.stringify(settingsData, null, 2)
    const settingsLines = settingsStr.split("\n")
    settingsLines.forEach((line, index) => {
      if (line.toLowerCase().includes(query)) {
        results.push({
          file: "settings.json",
          line: index + 1,
          content: line.trim()
        })
      }
    })

    const portfolioMockLines = [
      "import { Hero, Journey, Projects, Stack, Contact } from '@/components/sections'",
      "export default function Portfolio() {",
      "  const name = 'Igor Braz'",
      "  const role = 'Full Stack Developer'",
      "  return (",
      "    <div className='portfolio'>",
      "      <Hero name={name} role={role} />",
      "      <Journey />",
      "      <Projects />",
      "      <Stack />",
      "      <Contact />",
      "    </div>",
      "  )",
      "}"
    ]
    portfolioMockLines.forEach((line, index) => {
      if (line.toLowerCase().includes(query)) {
        results.push({
          file: "portfolio.tsx",
          line: index + 1,
          content: line.trim()
        })
      }
    })

  }, [searchQuery, locale])

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!commitMessage.trim()) return

    setGitStatus("committing")
    setTimeout(() => {
      setGitStatus("success")
      setHasChanges(false)
      setCommitMessage("")
      setTimeout(() => {
        setGitStatus("idle")
      }, 2000)
    }, 1500)
  }

  const renderTreeFile = (name: string, fileId: string, depth = 4) => {
    const isActive = activeFile === fileId
    return (
      <div
        onClick={() => handleFileClick(fileId)}
        className="flex items-center gap-1.5 py-1 pr-2 cursor-pointer transition-colors duration-150 select-none text-[13px] font-sans"
        style={{
          paddingLeft: `${depth * 6}px`,
          backgroundColor: isActive
            ? theme.colors["list.activeSelectionBackground"]
            : "transparent",
          color: isActive
            ? theme.colors["list.activeSelectionForeground"]
            : theme.colors["sideBar.foreground"]
        }}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = theme.colors["list.hoverBackground"] || ""
            e.currentTarget.style.color = theme.colors["list.hoverForeground"] || ""
          }
        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent"
            e.currentTarget.style.color = theme.colors["sideBar.foreground"] || ""
          }
        }}
      >
        <FileCode2 className="w-4 h-4 shrink-0 text-cyan-400" />
        <span className="truncate">{name}</span>
      </div>
    )
  }

  const renderTreeFolder = (name: string, folderKey: string, isOpen: boolean, depth = 2) => {
    return (
      <div
        onClick={() => toggleFolder(folderKey)}
        className="flex items-center gap-1 py-1 pr-2 cursor-pointer transition-colors duration-150 select-none text-[13px] font-sans"
        style={{
          paddingLeft: `${depth * 6}px`,
          color: theme.colors["sideBar.foreground"]
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors["list.hoverBackground"] || ""
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent"
        }}
      >
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
        )}
        {isOpen ? (
          <FolderOpen className="w-4 h-4 shrink-0 text-amber-400" />
        ) : (
          <Folder className="w-4 h-4 shrink-0 text-amber-400" />
        )}
        <span className="truncate font-medium">{name}</span>
      </div>
    )
  }

  const extensions = [
    { name: "Next.js", dev: "Vercel", desc: "The React framework for production-ready web apps.", version: "v15.0.0", color: "text-white bg-black" },
    { name: "React", dev: "Meta", desc: "Component-based declarative UI library.", version: "v19.0.0", color: "text-cyan-400 bg-slate-900" },
    { name: "TypeScript", dev: "Microsoft", desc: "Strongly typed programming language built on Javascript.", version: "v5.2.0", color: "text-blue-500 bg-white" },
    { name: "Tailwind CSS", dev: "Tailwind Labs", desc: "A utility-first CSS framework for rapid styling.", version: "v3.4.0", color: "text-sky-400 bg-slate-800" },
    { name: "Framer Motion", dev: "Matt Perry", desc: "A production-ready motion library for React.", version: "v11.0.0", color: "text-pink-500 bg-purple-950" },
    { name: "Three.js", dev: "Mr.doob", desc: "Lightweight 3D WebGL engine.", version: "v0.160.0", color: "text-green-400 bg-zinc-900" }
  ]

  if (isExpanded) return null

  return (
    <div
      className="hidden md:flex fixed top-9 bottom-8 left-0 z-40 select-none"
      style={{
        borderRight: `1px solid ${theme.colors["sideBar.border"]}`
      }}
    >
      <div
        className="w-12 h-full flex flex-col justify-between items-center py-2 relative"
        style={{
          backgroundColor: theme.colors["activityBar.background"],
          color: theme.colors["activityBar.foreground"]
        }}
      >
        <div className="flex flex-col gap-3.5 w-full items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeSidebarTab === tab.id && isSidebarOpen
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className="w-full py-1.5 flex justify-center relative group cursor-pointer transition-colors duration-150"
                style={{
                  color: isActive
                    ? theme.colors["activityBar.foreground"]
                    : theme.colors["activityBar.inactiveForeground"]
                }}
                title={tab.label}
              >
                {isActive && (
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2.5px]"
                    style={{ backgroundColor: theme.colors["activityBar.activeBorder"] }}
                  />
                )}
                <Icon className="w-6 h-6 transition-transform duration-200 group-hover:scale-105" />

                {tab.badge && (
                  <span
                    className="absolute bottom-1 right-2 text-[9px] px-1 rounded-full font-bold flex items-center justify-center min-w-3 h-3"
                    style={{
                      backgroundColor: theme.colors["badge.background"] || theme.colors["statusBar.background"],
                      color: theme.colors["badge.foreground"] || "#ffffff"
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-col gap-3.5 w-full items-center">
          <button
            onClick={() => {
              handleFileClick("igor.json")
            }}
            className="w-full py-1.5 flex justify-center group cursor-pointer"
            style={{
              color: activeFile === "igor.json"
                ? theme.colors["activityBar.foreground"]
                : theme.colors["activityBar.inactiveForeground"]
            }}
            title="Profile (igor.json)"
          >
            <User className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
          </button>
          <button
            onClick={() => {
              handleFileClick("settings.json")
            }}
            className="w-full py-1.5 flex justify-center group cursor-pointer"
            style={{
              color: activeFile === "settings.json"
                ? theme.colors["activityBar.foreground"]
                : theme.colors["activityBar.inactiveForeground"]
            }}
            title="Settings (settings.json)"
          >
            <SettingsIcon className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
          </button>
        </div>
      </div>

      <div
        className="w-60 h-full flex flex-col transition-all duration-300 overflow-hidden"
        style={{
          backgroundColor: theme.colors["sideBar.background"],
          width: isSidebarOpen ? "240px" : "0px",
          borderLeft: isSidebarOpen ? `1px solid ${theme.colors["sideBar.border"]}` : "none",
          opacity: isSidebarOpen ? 1 : 0,
          pointerEvents: isSidebarOpen ? "auto" : "none"
        }}
      >
        <div className="px-4 py-2.5 flex items-center justify-between border-b" style={{ borderColor: theme.colors["sideBar.border"] }}>
          <span className="text-[11px] font-bold tracking-wider uppercase" style={{ color: theme.colors["sideBar.foreground"] }}>
            {activeSidebarTab === "explorer" && "EXPLORER: PORTFOLIO"}
            {activeSidebarTab === "search" && "SEARCH"}
            {activeSidebarTab === "git" && "SOURCE CONTROL"}
            {activeSidebarTab === "extensions" && "EXTENSIONS"}
          </span>
          <MoreHorizontal className="w-4 h-4 opacity-60" style={{ color: theme.colors["sideBar.foreground"] }} />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin">
          {activeSidebarTab === "explorer" && (
            <div className="py-2">
              <div className="px-2 font-bold text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: theme.colors["sideBar.foreground"], opacity: 0.8 }}>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>portfolio-workspace</span>
              </div>

              <div className="flex flex-col">
                {renderTreeFolder("components", "components", openFolders.components, 2)}
                {openFolders.components && (
                  <>
                    {renderTreeFolder("features", "componentsFeatures", openFolders.componentsFeatures, 3)}
                    {renderTreeFolder("ide", "componentsIde", openFolders.componentsIde, 3)}
                    {renderTreeFolder("layout", "componentsLayout", openFolders.componentsLayout, 3)}
                  </>
                )}

                {renderTreeFolder("data", "data", openFolders.data, 2)}
                {openFolders.data && (
                  <>
                    {renderTreeFolder("about", "dataAbout", openFolders.dataAbout, 3)}
                    {openFolders.dataAbout && (
                      <div className="opacity-80 pl-8 text-[12px] py-0.5 text-zinc-500 italic">
                        about/pt.json
                      </div>
                    )}
                  </>
                )}

                {renderTreeFile("portfolio.tsx", "portfolio.tsx", 2)}
                {renderTreeFile("igor.json", "igor.json", 2)}
                {renderTreeFile("settings.json", "settings.json", 2)}

                {renderTreeFolder("config", "config", openFolders.config, 2)}
                {openFolders.config && (
                  <div className="pl-6 text-[12px] opacity-60 flex flex-col gap-1 py-1" style={{ color: theme.colors["sideBar.foreground"] }}>
                    <span>package.json</span>
                    <span>tsconfig.json</span>
                    <span>next.config.mjs</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSidebarTab === "search" && (
            <div className="p-3 space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Pesquisar termo..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-2 py-1 text-xs rounded border focus:outline-none"
                  style={{
                    backgroundColor: theme.colors["input.background"],
                    borderColor: theme.colors["input.border"],
                    color: theme.colors["input.foreground"]
                  }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1.5 text-xs opacity-60 hover:opacity-100"
                    style={{ color: theme.colors["input.foreground"] }}
                  >
                    ×
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                <div className="text-[11px] opacity-70 font-semibold" style={{ color: theme.colors["sideBar.foreground"] }}>
                  {searchResults.length > 0
                    ? `${searchResults.length} resultados encontrados:`
                    : searchQuery
                      ? "Nenhum resultado encontrado."
                      : "Digite algo para pesquisar no projeto..."}
                </div>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleFileClick(result.file)}
                      className="p-1.5 rounded cursor-pointer transition-colors text-xs font-mono border border-transparent hover:border-zinc-800"
                      style={{
                        backgroundColor: theme.colors["editor.background"]
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors["list.hoverBackground"] || ""}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = theme.colors["editor.background"] || ""}
                    >
                      <div className="flex justify-between items-center text-[10px] font-sans font-bold opacity-60 mb-0.5" style={{ color: theme.colors["sideBar.foreground"] }}>
                        <span className="text-cyan-400">{result.file}</span>
                        <span>Linha {result.line}</span>
                      </div>
                      <div className="truncate" style={{ color: theme.colors["editor.foreground"] }}>
                        {result.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSidebarTab === "git" && (
            <div className="p-3 space-y-4">
              <div className="flex justify-between items-center text-xs opacity-75" style={{ color: theme.colors["sideBar.foreground"] }}>
                <span className="flex items-center gap-1"><GitBranch className="w-3.5 h-3.5" /> branch: <strong>main</strong></span>
                <span className="text-[10px] font-bold text-amber-500">1 pendência</span>
              </div>

              <form onSubmit={handleCommit} className="space-y-3">
                <textarea
                  placeholder="Mensagem de commit (Ctrl+Enter para commitar)..."
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  className="w-full h-20 p-2 text-xs rounded border focus:outline-none resize-none"
                  style={{
                    backgroundColor: theme.colors["input.background"],
                    borderColor: theme.colors["input.border"],
                    color: theme.colors["input.foreground"]
                  }}
                />

                <button
                  type="submit"
                  disabled={!commitMessage.trim() || gitStatus !== "idle" || !hasChanges}
                  className="w-full py-1.5 text-xs font-semibold rounded flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:brightness-95 transition-all"
                  style={{
                    backgroundColor: theme.colors["button.background"] || theme.colors["statusBar.background"],
                    color: theme.colors["button.foreground"] || "#ffffff"
                  }}
                >
                  {gitStatus === "committing" ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Commiting & Pushing...</span>
                    </>
                  ) : gitStatus === "success" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Sincronizado!</span>
                    </>
                  ) : (
                    <>
                      <GitCommit className="w-3.5 h-3.5" />
                      <span>Commit & Push</span>
                    </>
                  )}
                </button>
              </form>

              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-semibold uppercase tracking-wider opacity-60" style={{ color: theme.colors["sideBar.foreground"] }}>
                  Alterações
                </div>
                {hasChanges ? (
                  <div
                    onClick={() => handleFileClick("portfolio.tsx")}
                    className="flex justify-between items-center p-1.5 rounded cursor-pointer text-xs"
                    style={{ color: theme.colors["sideBar.foreground"] }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors["list.hoverBackground"] || ""}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div className="flex items-center gap-1.5">
                      <FileCode2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>portfolio.tsx</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">M</span>
                  </div>
                ) : (
                  <div className="text-xs italic opacity-50 px-2" style={{ color: theme.colors["sideBar.foreground"] }}>
                    Nenhuma alteração pendente.
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSidebarTab === "extensions" && (
            <div className="p-2 space-y-2">
              <div className="text-[10px] font-bold px-2 py-1 uppercase opacity-60" style={{ color: theme.colors["sideBar.foreground"] }}>
                Instaladas (Tech Stack)
              </div>
              <div className="space-y-1">
                {extensions.map((ext, index) => (
                  <div
                    key={index}
                    className="flex gap-2 p-2 rounded cursor-default border border-transparent hover:border-zinc-800"
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors["list.hoverBackground"] || ""}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center font-bold text-xs ${ext.color}`}>
                      {ext.name[0]}
                    </div>
                    <div className="flex-1 min-w-0" style={{ color: theme.colors["sideBar.foreground"] }}>
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-bold truncate leading-tight">{ext.name}</h4>
                        <span className="text-[9px] opacity-60 whitespace-nowrap">{ext.version}</span>
                      </div>
                      <p className="text-[10px] opacity-75 truncate leading-snug">{ext.desc}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] opacity-50">{ext.dev}</span>
                        <span className="text-[9px] px-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">Active</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
