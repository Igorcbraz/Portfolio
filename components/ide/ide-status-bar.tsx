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
  Package,
  Mouse
} from "lucide-react"
import { vscodeThemes, type VSCodeThemeName } from "@/lib/vscode-themes"
import { accentColors, type CursorPreset, type AccentColor, cursorPresets } from "@/lib/cursor-styles"
import { analytics } from "@/lib/analytics"

interface TechSpec {
  name: string
  version?: string
  category: string
}

export function IDEStatusBar() {
  const { dictionary } = useLocale()
  const { isExpanded, setIsExpanded, theme, themeName, setTheme, cursorConfig, setCursorPreset, setCursorColor, isConsoleOpen, setIsConsoleOpen } = useVSCode()
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [loadTime, setLoadTime] = useState<number>(0)
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading")
  const [copied, setCopied] = useState(false)
  const [isCursorDialogOpen, setIsCursorDialogOpen] = useState(false)



  const colorOptions: { value: AccentColor; label: string }[] = [
    { value: "blue", label: "Azul" },
    { value: "purple", label: "Roxo" },
    { value: "green", label: "Verde" },
    { value: "pink", label: "Rosa" },
    { value: "orange", label: "Laranja" },
    { value: "red", label: "Vermelho" },
    { value: "cyan", label: "Ciano" },
    { value: "yellow", label: "Amarelo" },
  ]

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
            className="flex items-center gap-1 p-1 rounded transition-colors cursor-pointer"
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
                    className="flex items-center gap-1 p-1 rounded transition-opacity hover:opacity-80 cursor-pointer"
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
                  className="cursor-pointer"
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

          <Dialog open={isCursorDialogOpen} onOpenChange={setIsCursorDialogOpen}>
            <Tooltip>
              <TooltipTrigger asChild>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 p-1 rounded transition-opacity hover:opacity-80 cursor-pointer">
                    <Mouse
                      className="w-3.5 h-3.5"
                      style={{
                        color: isCursorDialogOpen
                          ? theme.colors["activityBar.activeBorder"]
                          : accentColors[cursorConfig.color].primary
                      }}
                    />
                  </button>
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Customizar cursor</p>
              </TooltipContent>
            </Tooltip>
            <DialogContent
              className="w-[95vw] max-w-4xl max-h-[85vh] overflow-y-auto"
              style={{
                backgroundColor: theme.colors["editor.background"],
                borderColor: theme.colors["panel.border"] || "#3c3c3c",
                color: theme.colors["editor.foreground"]
              }}
            >
              <DialogHeader>
                <DialogTitle className="text-sm sm:text-base" style={{ color: theme.colors["editor.foreground"] }}>
                  Customização de Cursor
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm" style={{ color: theme.colors["statusBar.foreground"] }}>
                  Personalize o estilo, cor e comportamento do cursor
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3" style={{ color: theme.colors["editor.foreground"] }}>
                    Escolha um Preset
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                    {Object.entries(cursorPresets).map(([key, preset]) => {
                      const color = accentColors[cursorConfig.color]
                      const isSelected = cursorConfig.preset === key
                      return (
                        <button
                          key={key}
                          onClick={() => setCursorPreset(key as CursorPreset)}
                          className="relative p-2 sm:p-4 rounded border hover:scale-105 transition-all group"
                          style={{
                            backgroundColor: isSelected
                              ? (theme.colors as Record<string, string>)["editor.selectionBackground"]
                              ?? theme.colors["editor.background"]
                              : theme.colors["editor.background"],
                            borderColor: isSelected
                              ? color.primary
                              : theme.colors["panel.border"] || "#3c3c3c",
                            borderWidth: isSelected ? "2px" : "1px",
                            minHeight: "90px",
                          }}
                        >
                          <div className="flex items-center justify-center mb-2 sm:mb-3 h-8 sm:h-10">
                            {preset.renderStyle === "minimal" && (
                              <div
                                className="rounded-full"
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  backgroundColor: color.primary
                                }}
                              />
                            )}

                            {preset.renderStyle === "default" && (
                              <div className="relative">
                                <div
                                  className="rounded-full bg-white"
                                  style={{
                                    width: "5px",
                                    height: "5px"
                                  }}
                                />
                                <div
                                  className="absolute -inset-2 rounded-full border"
                                  style={{
                                    borderColor: `${color.primary}99`
                                  }}
                                />
                              </div>
                            )}

                            {preset.renderStyle === "crosshair" && (
                              <div className="relative w-8 h-8">
                                <div
                                  className="absolute"
                                  style={{
                                    width: "12px",
                                    height: "1px",
                                    backgroundColor: color.primary,
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)"
                                  }}
                                />
                                <div
                                  className="absolute"
                                  style={{
                                    width: "1px",
                                    height: "12px",
                                    backgroundColor: color.primary,
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)"
                                  }}
                                />
                                <div
                                  className="absolute border-l border-t"
                                  style={{
                                    width: "4px",
                                    height: "4px",
                                    borderColor: color.secondary,
                                    left: "2px",
                                    top: "2px"
                                  }}
                                />
                                <div
                                  className="absolute border-r border-t"
                                  style={{
                                    width: "4px",
                                    height: "4px",
                                    borderColor: color.secondary,
                                    right: "2px",
                                    top: "2px"
                                  }}
                                />
                              </div>
                            )}

                            {preset.renderStyle === "spotlight" && (
                              <div className="relative">
                                <div
                                  className="rounded-full"
                                  style={{
                                    width: "24px",
                                    height: "24px",
                                    background: `radial-gradient(circle, ${color.glow}, transparent 70%)`,
                                    opacity: 0.6
                                  }}
                                />
                                <div
                                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                                  style={{
                                    width: "4px",
                                    height: "4px",
                                    backgroundColor: color.primary,
                                    boxShadow: `0 0 8px ${color.glow}`
                                  }}
                                />
                              </div>
                            )}

                            {preset.renderStyle === "ripple" && (
                              <div className="relative">
                                <div
                                  className="rounded-full"
                                  style={{
                                    width: "4px",
                                    height: "4px",
                                    backgroundColor: color.primary
                                  }}
                                />
                                {[8, 14, 20].map((size, i) => (
                                  <div
                                    key={i}
                                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
                                    style={{
                                      width: `${size}px`,
                                      height: `${size}px`,
                                      borderColor: color.primary,
                                      opacity: 0.5 - i * 0.15
                                    }}
                                  />
                                ))}
                              </div>
                            )}

                            {preset.renderStyle === "vortex" && (
                              <div className="relative w-8 h-8">
                                {[0, 1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="absolute rounded-full"
                                    style={{
                                      width: `${3 + i * 2}px`,
                                      height: `${3 + i * 2}px`,
                                      left: `${Math.cos((i * Math.PI) / 2) * (4 + i * 2) + 14}px`,
                                      top: `${Math.sin((i * Math.PI) / 2) * (4 + i * 2) + 14}px`,
                                      backgroundColor: color.primary,
                                      opacity: 0.8 - i * 0.15
                                    }}
                                  />
                                ))}
                                <div
                                  className="absolute rounded-full"
                                  style={{
                                    width: "5px",
                                    height: "5px",
                                    left: "50%",
                                    top: "50%",
                                    transform: "translate(-50%, -50%)",
                                    backgroundColor: color.primary,
                                    boxShadow: `0 0 10px ${color.glow}`
                                  }}
                                />
                              </div>
                            )}

                            {preset.renderStyle === "trail" && (
                              <div className="relative">
                                {[0, 1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="rounded-full absolute"
                                    style={{
                                      width: `${6 - i * 1.2}px`,
                                      height: `${6 - i * 1.2}px`,
                                      left: `${i * 3}px`,
                                      backgroundColor: color.primary,
                                      opacity: 0.8 - i * 0.2
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="text-center">
                            <div className="font-bold text-[10px] sm:text-xs mb-0.5 sm:mb-1">{preset.name}</div>
                            <div className="text-[9px] sm:text-[10px] opacity-70 hidden sm:block">{preset.description}</div>
                          </div>

                          {isSelected && (
                            <div
                              className="absolute top-1 right-1 sm:top-2 sm:right-2 w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center text-white text-[10px] sm:text-xs font-bold"
                              style={{ backgroundColor: color.primary }}
                            >
                              ✓
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3" style={{ color: theme.colors["editor.foreground"] }}>
                    Escolha uma Cor
                  </h3>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setCursorColor(color.value)}
                        className="relative p-3 sm:p-4 rounded border hover:scale-110 transition-transform"
                        style={{
                          backgroundColor: accentColors[color.value].primary,
                          borderColor: cursorConfig.color === color.value ? "#ffffff" : "transparent",
                          borderWidth: "2px",
                          boxShadow: cursorConfig.color === color.value
                            ? `0 0 12px ${accentColors[color.value].glow}`
                            : "none",
                        }}
                        title={color.label}
                      >
                        {cursorConfig.color === color.value && (
                          <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-xs">
                            ✓
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

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
