"use client"

import { useEffect, useState, useRef } from "react"
import { Terminal, X, Minimize2, Maximize2 } from "lucide-react"
import { Button } from "@/components/ui"
import { motion, AnimatePresence } from "framer-motion"
import { useVSCode } from "@/contexts/VSCodeContext"

interface ConsoleLog {
  timestamp: string
  type: "info" | "success" | "warning" | "error"
  message: string
}

interface DevConsoleProps {
  isOpen: boolean
  onClose: () => void
}

export function DevConsole({ isOpen, onClose }: DevConsoleProps) {
  const [isMinimized, setIsMinimized] = useState(false)
  const [logs, setLogs] = useState<ConsoleLog[]>([])
  const consoleRef = useRef<HTMLDivElement>(null)
  const { theme } = useVSCode()

  const addLog = (type: ConsoleLog["type"], message: string) => {
    const timestamp = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      fractionalSecondDigits: 3,
    })
    setLogs((prev) => [...prev, { timestamp, type, message }])
  }

  useEffect(() => {
    const initialLogs = [
      { type: "info" as const, message: "Windows PowerShell" },
      { type: "info" as const, message: "Copyright (C) Microsoft Corporation. All rights reserved." },
      { type: "info" as const, message: "" },
      { type: "success" as const, message: "PS C:\\Portfolio> npm run dev" },
      { type: "info" as const, message: "" },
      { type: "success" as const, message: "  ▲ Next.js 15.0.0" },
      { type: "info" as const, message: "  - Local:        http://localhost:3000" },
      { type: "success" as const, message: "  ✓ Ready in 1.2s" },
      { type: "info" as const, message: "" },
      { type: "info" as const, message: "  ○ Compiling / ..." },
      { type: "success" as const, message: "  ✓ Compiled / in 847ms" },
    ]

    initialLogs.forEach((log, index) => {
      setTimeout(() => {
        const timestamp = new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          fractionalSecondDigits: 3,
        })
        setLogs((prev) => [...prev, { timestamp, ...log }])
      }, index * 250)
    })

    const handleScroll = () => {
      if (Math.random() > 0.95) {
        const section = getCurrentSection()
        addLog("info", `> Navigating to section: ${section}`)
      }
    }

    const handleClick = () => {
      if (Math.random() > 0.9) {
        addLog("success", "✓ User interaction detected")
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("click", handleClick)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("click", handleClick)
    }
  }, [])

  useEffect(() => {
    if (consoleRef.current && !isMinimized) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight
    }
  }, [logs, isMinimized])

  const getCurrentSection = () => {
    const sections = ["hero", "journey", "github", "projects", "articles", "stack", "contact"]
    const scrollPosition = window.scrollY + window.innerHeight / 2

    for (const sectionId of sections) {
      const element = document.getElementById(sectionId)
      if (element) {
        const rect = element.getBoundingClientRect()
        const absoluteTop = scrollPosition - rect.height / 2
        if (scrollPosition >= absoluteTop && scrollPosition < absoluteTop + rect.height) {
          return sectionId
        }
      }
    }
    return "unknown"
  }

  const getLogColor = (type: ConsoleLog["type"]) => {
    switch (type) {
      case "success":
        return theme.colors["terminal.ansiGreen"]
      case "error":
        return theme.colors["terminal.ansiRed"]
      case "warning":
        return theme.colors["terminal.ansiYellow"]
      default:
        return theme.colors["terminal.foreground"]
    }
  }

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{
            y: 0,
            opacity: 1,
            height: isMinimized ? "40px" : typeof window !== 'undefined' && window.innerWidth < 768 ? "240px" : "320px"
          }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{
            type: "spring",
            damping: 30,
            stiffness: 400
          }}
          className="fixed left-0 right-0 bottom-8 z-999 border-t shadow-2xl"
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            backgroundColor: theme.colors["panel.background"],
            borderColor: theme.colors["panel.border"]
          }}
        >
          <div
            className="flex items-center justify-between px-2 sm:px-4 py-2 border-b"
            style={{
              backgroundColor: theme.colors["editorGroupHeader.tabsBackground"],
              borderColor: theme.colors["panel.border"]
            }}
          >
            <div className="flex items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Terminal
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5"
                  style={{ color: theme.colors["panelTitle.activeForeground"] }}
                />
                <span
                  className="text-[10px] sm:text-[11px] font-medium tracking-wide"
                  style={{ color: theme.colors["panelTitle.activeForeground"] }}
                >
                  TERMINAL
                </span>
                <span
                  className="text-[9px] sm:text-[10px] ml-0.5 sm:ml-1 hidden sm:inline"
                  style={{ color: theme.colors["panelTitle.inactiveForeground"] }}
                >
                  powershell
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-[10px]">
                <button
                  className="hover:opacity-80 transition-opacity"
                  style={{ color: theme.colors["panelTitle.inactiveForeground"] }}
                  onClick={() => setLogs([])}
                >
                  <span
                    className="px-2 py-0.5 rounded text-[10px]"
                    style={{
                      color: theme.colors["panelTitle.inactiveForeground"]
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = theme.colors["list.hoverBackground"]
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }}
                  >
                    Clear
                  </span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                style={{
                  color: theme.colors["panelTitle.activeForeground"]
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors["list.hoverBackground"]
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                ) : (
                  <Minimize2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-5 w-5 sm:h-6 sm:w-6 p-0"
                style={{
                  color: theme.colors["panelTitle.activeForeground"]
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = theme.colors["list.hoverBackground"]
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent"
                }}
                onClick={onClose}
              >
                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              </Button>
            </div>
          </div>
          <AnimatePresence mode="wait">
            {!isMinimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "calc(100% - 40px)" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                ref={consoleRef}
                className="px-3 py-2 overflow-y-auto scrollbar-thin"
                style={{
                  backgroundColor: theme.colors["terminal.background"],
                  "--scrollbar-thumb": theme.colors["editorGroup.border"],
                  "--scrollbar-track": theme.colors["terminal.background"]
                } as React.CSSProperties}
              >
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.015, duration: 0.15 }}
                    className="text-[10px] sm:text-[11px] leading-[1.6]"
                  >
                    <span
                      className="whitespace-pre-wrap wrap-break-word"
                      style={{ color: getLogColor(log.type) }}
                    >
                      {log.message}
                    </span>
                  </motion.div>
                ))}
                {logs.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="py-8 text-[10px] sm:text-[11px]"
                    style={{ color: theme.colors["panelTitle.inactiveForeground"] }}
                  >
                    <span style={{ color: theme.colors["terminal.ansiBlue"] }}>PS</span>{" "}
                    <span style={{ color: theme.colors["terminal.ansiYellow"] }}>C:\Portfolio&gt;</span>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
