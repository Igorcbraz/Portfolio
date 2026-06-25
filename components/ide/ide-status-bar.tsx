"use client"

import { useEffect, useState } from "react"
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { Button, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui"
import { Maximize2, Minimize2, Terminal } from "lucide-react"
import { DevConsole } from "@/components/features"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, Badge, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui"
import {
  Activity,
  RefreshCw,
  Info,
  Clock,
  Share2,
  MousePointer2,
  Zap,
  Cpu,
  Check,
  Copy,
  Palette,
  Box,
  Code2,
  Paintbrush,
  Sparkles,
  Package
} from "lucide-react"
import { vscodeThemes, type VSCodeThemeName } from "@/lib/vscode-themes"
import { analytics } from "@/lib/analytics"

interface TechSpec {
  name: string
  version?: string
  category: string
}

export function IDEStatusBar() {
  const { dictionary } = useLocale()
  const { isExpanded, setIsExpanded, theme, themeName, setTheme, isConsoleOpen, setIsConsoleOpen } = useVSCode()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [loadTime, setLoadTime] = useState<number>(0)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const calculateLoadTime = () => {
      if (performance.timing) {
        const perfData = performance.timing
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
        if (pageLoadTime > 0) {
          setLoadTime(Math.round(pageLoadTime / 1000 * 100) / 100)
        }
      }
      setStatus("ready")
    }

    if (document.readyState === "complete") {
      calculateLoadTime()
    } else {
      window.addEventListener("load", calculateLoadTime)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const line = Math.floor((window.scrollY + e.clientY) / 24) + 1
      const column = Math.floor(e.clientX / 8) + 1
      setMousePos({ x: line, y: column })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("load", calculateLoadTime)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  const handleRestart = () => {
    analytics.trackClick("restart", "ide")
    setStatus("loading")
    setTimeout(() => {
      window.location.reload()
    }, 300)
  }

  const handleShare = async () => {
    analytics.trackClick("share", "ide")
    const shareData = {
      title: "Igor Braz - Portfolio",
      text: "Confira este portfolio incrível de desenvolvedor!",
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch (err) {
      console.log("Erro ao compartilhar:", err)
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "loading":
        return theme.colors["terminal.ansiYellow"] || "#eab308"
      case "ready":
        return theme.colors["terminal.ansiGreen"] || "#22c55e"
      case "error":
        return theme.colors["terminal.ansiRed"] || "#ef4444"
      default:
        return theme.colors["statusBar.foreground"]
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "loading":
        return "Carregando..."
      case "ready":
        return "Pronto"
      case "error":
        return "Erro"
      default:
        return "Desconhecido"
    }
  }



  const StatusButton = ({
    children,
    onClick,
    tooltip
  }: {
    children: React.ReactNode
    onClick?: () => void
    tooltip: string
  }) => {
    const [isHovered, setIsHovered] = useState(false)

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="flex items-center gap-1 p-1 rounded transition-colors cursor-pointer cursor-target"
            style={{
              backgroundColor: isHovered ? theme.colors["list.hoverBackground"] : "transparent"
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <TooltipProvider>
      <div
        className="hidden md:flex fixed bottom-0 left-0 right-0 z-999 h-8 text-xs items-center justify-between px-2 select-none leading-normal transition-all duration-700 ease-in-out"
        style={{
          backgroundColor: theme.colors["statusBar.background"],
          borderTop: `1px solid ${theme.colors["statusBar.border"]}`,
          color: theme.colors["statusBar.foreground"],
          borderRadius: isExpanded ? 0 : '0 0 0.75rem 0.75rem'
        }}
      >
        <div className="flex items-center gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-2 py-0.5">
                <Activity className="w-3.5 h-3.5" style={{ color: getStatusColor() }} />
                <span className="text-[11px]">{getStatusText()}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Status do servidor</p>
            </TooltipContent>
          </Tooltip>

          <StatusButton onClick={handleRestart} tooltip="Reiniciar (F5)">
            <RefreshCw className="w-3.5 h-3.5" />
          </StatusButton>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-2 py-0.5">
                <Clock className="w-3.5 h-3.5" style={{ color: theme.colors["terminal.ansiBlue"] || "#60a5fa" }} />
                <span className="text-[11px]">{loadTime}s</span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tempo de carregamento</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-2 py-0.5">
                <Zap className="w-3.5 h-3.5" style={{ color: theme.colors["terminal.ansiYellow"] || "#facc15" }} />
                <span className="text-[11px]">
                  {loadTime < 1 ? "Rápido" : loadTime < 3 ? "Normal" : "Lento"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Performance do site</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-3">
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center gap-1 p-1 rounded transition-opacity hover:opacity-80 cursor-pointer cursor-target"
                  >
                    <Palette className="w-3.5 h-3.5" style={{ color: theme.colors["activityBar.activeBorder"] }} />
                  </button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Tema: {theme.name}</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent
              align="end"
              className="w-56"
              style={{
                backgroundColor: theme.colors["dropdown.background"],
                borderColor: theme.colors["dropdown.border"],
                color: theme.colors["dropdown.foreground"]
              }}
            >
              <DropdownMenuLabel>Escolha um tema</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(vscodeThemes).map(([key, themeOption]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => {
                    setTheme(key as VSCodeThemeName)
                    analytics.trackThemeChange(key)
                  }}
                  className="cursor-pointer cursor-target"
                  style={{
                    backgroundColor: themeName === key ? theme.colors["list.activeSelectionBackground"] : "transparent",
                    color: themeName === key ? theme.colors["list.activeSelectionForeground"] : theme.colors["dropdown.foreground"]
                  }}
                >
                  <div className="flex items-center justify-between w-full">
                    <span>{themeOption.name}</span>
                    {themeName === key && <Check className="w-4 h-4" />}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <StatusButton
            onClick={() => {
              analytics.trackIDEInteraction(isExpanded ? "close" : "open", "StatusBar")
              setIsExpanded(!isExpanded)
            }}
            tooltip={isExpanded ? "Mostrar IDE" : "Expandir Site"}
          >
            {isExpanded ? (
              <Minimize2 className="w-3.5 h-3.5" style={{ color: theme.colors["activityBar.activeBorder"] }} />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" style={{ color: theme.colors["activityBar.activeBorder"] }} />
            )}
          </StatusButton>

          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1.5 px-2 py-0.5">
                <MousePointer2 className="w-3.5 h-3.5" style={{ color: theme.colors["terminal.ansiMagenta"] || "#c084fc" }} />
                <span className="text-[11px]">
                  Ln {mousePos.x}, Col {mousePos.y}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Posição do cursor</p>
            </TooltipContent>
          </Tooltip>

          <StatusButton
            onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            tooltip="Console do desenvolvedor"
          >
            <Terminal
              className="w-3.5 h-3.5"
              style={{
                color: isConsoleOpen
                  ? theme.colors["activityBar.activeBorder"]
                  : theme.colors["statusBar.foreground"]
              }}
            />
          </StatusButton>



          <StatusButton onClick={handleShare} tooltip={copied ? "Link copiado!" : "Compartilhar"}>
            {copied ? (
              <Check className="w-3.5 h-3.5" style={{ color: theme.colors["terminal.ansiGreen"] || "#4ade80" }} />
            ) : (
              <Share2 className="w-3.5 h-3.5" style={{ color: theme.colors["terminal.ansiYellow"] || "#fb923d" }} />
            )}
          </StatusButton>
        </div>
      </div>

      <DevConsole isOpen={isConsoleOpen} onClose={() => setIsConsoleOpen(false)} />
    </TooltipProvider>
  )
}
