import { useEffect, useState, useMemo, memo } from "react"
import { useLocale } from "@/contexts/LocaleContext"
import { AnimatePresence, motion } from "framer-motion"
import scrollDataEn from "@/locales/scroll-progress/en.json"
import scrollDataPt from "@/locales/scroll-progress/pt.json"
import { Terminal, User, Briefcase, Code, FolderGit, BookOpen, Cpu, Send, CheckCircle2, MousePointerClick } from "lucide-react"

type ScrollMilestone = {
  key: string
  progress: number
  icon: string
  sectionId: string
  query: string
}

const highlightSQL = (query: string, typedLength?: number) => {
  const keywords = ['SELECT', 'FROM', 'WHERE', 'INSERT', 'INTO', 'VALUES', 'ORDER', 'BY', 'DESC', 'ASC', 'LIMIT', 'BEGIN', 'COMMIT', 'TRANSACTION']
  const functions = ['COUNT', 'MAX', 'MIN', 'AVG', 'SUM']

  const tokens = query.split(/(\s+|,|\(|\)|'[^']*'|--[^\n]*)/g).filter(Boolean)

  if (typedLength === undefined) {
    return tokens.map((token, index) => {
      let colorClass = "text-foreground"
      let fontWeight = ""

      if (token.startsWith('--')) {
        colorClass = "text-green-600 dark:text-green-400"
      } else if (token.startsWith("'") && token.endsWith("'")) {
        colorClass = "text-orange-600 dark:text-orange-400"
      } else if (keywords.includes(token.toUpperCase())) {
        colorClass = "text-blue-600 dark:text-blue-400"
        fontWeight = "font-semibold"
      } else if (functions.includes(token.toUpperCase())) {
        colorClass = "text-purple-600 dark:text-purple-400"
        fontWeight = "font-semibold"
      } else if (/^\d+$/.test(token)) {
        colorClass = "text-cyan-600 dark:text-cyan-400"
      } else if (['=', '>', '<', ',', '(', ')', ';'].includes(token)) {
        colorClass = "text-foreground/70"
      }

      return <span key={index} className={`${colorClass} ${fontWeight}`}>{token}</span>
    })
  }

  let charIndex = 0
  return tokens.map((token, tokenIndex) => {
    let colorClass = "text-foreground"
    let fontWeight = ""

    if (token.startsWith('--')) {
      colorClass = "text-green-600 dark:text-green-400"
    } else if (token.startsWith("'") && token.endsWith("'")) {
      colorClass = "text-orange-600 dark:text-orange-400"
    } else if (keywords.includes(token.toUpperCase())) {
      colorClass = "text-blue-600 dark:text-blue-400"
      fontWeight = "font-semibold"
    } else if (functions.includes(token.toUpperCase())) {
      colorClass = "text-purple-600 dark:text-purple-400"
      fontWeight = "font-semibold"
    } else if (/^\d+$/.test(token)) {
      colorClass = "text-cyan-600 dark:text-cyan-400"
    } else if (['=', '>', '<', ',', '(', ')', ';'].includes(token)) {
      colorClass = "text-foreground/70"
    }

    const chars = token.split('')
    const visibleChars = chars.map((char) => {
      const isVisible = charIndex < typedLength
      charIndex++
      return isVisible ? char : ''
    }).join('')

    if (!visibleChars) return null

    return (
      <span key={tokenIndex} className={`${colorClass} ${fontWeight}`}>
        {visibleChars}
      </span>
    )
  })
}

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  start: Terminal,
  know: User,
  journey: Briefcase,
  github: Code,
  projects: FolderGit,
  articles: BookOpen,
  tech: Cpu,
  contact: Send,
  end: CheckCircle2,
}

type SQLConsoleProps = {
  query: string
  label: string
  layout: "desktop" | "mobile"
}

const SQLConsole = memo(function SQLConsole({ query, label, layout }: SQLConsoleProps) {
  const [typedLength, setTypedLength] = useState(0)
  const [isExecuting, setIsExecuting] = useState(true)

  useEffect(() => {
    setTypedLength(0)
    setIsExecuting(true)

    let cancelled = false

    const typeWriter = () => {
      let current = 0

      const tick = () => {
        if (cancelled) return

        current++

        setTypedLength(current)

        if (current < query.length) {
          setTimeout(tick, 15)
        } else {
          setIsExecuting(false)
        }
      }

      tick()
    }

    typeWriter()

    return () => {
      cancelled = true
    }
  }, [query])

  const statusIndicator = (
    <AnimatePresence mode="wait">
      {isExecuting ? (
        <motion.div
          key="executing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1"
        >
          <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-yellow-500 font-mono text-[9px] uppercase tracking-wider">executing</span>
        </motion.div>
      ) : (
        <motion.div
          key="ready"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center gap-1"
        >
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span className="text-green-500 font-mono text-[9px] uppercase tracking-wider">ready</span>
        </motion.div>
      )}
    </AnimatePresence>
  )

  if (layout === "mobile") {
    return (
      <div className="space-y-1">
        <div className="flex justify-end text-[9px] h-3.5">
          {statusIndicator}
        </div>
        <div className="bg-muted/30 border border-border rounded-none p-2 text-[9px] sm:text-[10px] leading-relaxed overflow-x-auto">
          <code className="whitespace-pre-wrap break-all font-mono">
            {highlightSQL(query, typedLength)}
            <span className="text-primary cursor-blink ml-0.5 font-bold">■</span>
          </code>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold font-mono">
            -- {label}
          </p>
        </div>
        <div className="text-[9px] h-3.5">
          {statusIndicator}
        </div>
      </div>

      <div className="bg-muted/30 border border-border rounded-none p-2 text-[10px] leading-relaxed overflow-x-auto">
        <code className="whitespace-pre-wrap break-all font-mono">
          {highlightSQL(query, typedLength)}
          <span className="text-primary cursor-blink ml-0.5 font-bold">■</span>
        </code>
      </div>
    </div>
  )
})

export function ScrollProgress() {
  const { dictionary, locale } = useLocale()
  const [enabled, setEnabled] = useState(false)

  const bundles: Record<string, { milestones: ScrollMilestone[] }> = {
    en: scrollDataEn as { milestones: ScrollMilestone[] },
    pt: scrollDataPt as { milestones: ScrollMilestone[] },
  }

  const staticMilestones = bundles[locale]?.milestones || bundles.en.milestones

  const milestones = useMemo(() => staticMilestones.map((s) => ({
    key: s.key,
    progress: s.progress,
    icon: s.icon,
    query: s.query,
    sectionId: s.sectionId,
    label: dictionary.scrollProgress.milestones[s.key].label,
    message: dictionary.scrollProgress.milestones[s.key].message,
  })), [dictionary, staticMilestones])

  const [scrollProgress, setScrollProgress] = useState(0)
  const currentMilestone = useMemo(() => {
    return [...milestones].reverse().find(
      m => scrollProgress >= m.progress
    ) || milestones[0]
  }, [scrollProgress, milestones])
  const [showTooltip, setShowTooltip] = useState(true)

  useEffect(() => {
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return

    let ticking = false

    const updateScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = Math.min(100, Math.max(0, (scrolled / documentHeight) * 100))

      setScrollProgress(progress)

      if (scrolled > 100 && showTooltip) {
        setShowTooltip(false)
      }
      ticking = false
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    updateScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [showTooltip, milestones, enabled])

  if (!enabled) return null

  return (
    <>
      <div className="hidden lg:flex fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-50 group">
        <div className="relative">
          <div className="relative transition-all duration-300 w-1.5">
            <div className="relative h-[50vh] bg-card/95 backdrop-blur-md border border-border/50 rounded-none shadow-2xl overflow-hidden">
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-500 ease-out"
                style={{
                  height: `${scrollProgress}%`,
                  willChange: 'height'
                }}
              >
                <div className="absolute inset-0 bg-linear-to-t from-primary/90 via-primary/70 to-accent/60"></div>
                <div className="absolute inset-0 bg-linear-to-t from-primary/50 via-accent/40 to-transparent"></div>

                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `repeating-linear-gradient(
                      0deg,
                      transparent,
                      transparent 15px,
                      rgba(255, 255, 255, 0.15) 15px,
                      rgba(255, 255, 255, 0.15) 30px
                    )`,
                    animation: 'smoothWave 3s ease-in-out infinite'
                  }}
                ></div>

                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)',
                    animation: 'shimmerUp 4s ease-in-out infinite'
                  }}
                ></div>

                <div className="absolute -inset-2 bg-linear-to-t from-primary/30 via-accent/20 to-transparent blur-xl opacity-60"></div>

                <div className="absolute top-0 left-0 right-0 h-6">
                  <div
                    className="absolute inset-0 bg-linear-to-b from-accent/40 via-primary/20 to-transparent blur-md"
                    style={{
                      animation: 'liquidSurface 2.5s ease-in-out infinite'
                    }}
                  ></div>
                </div>

                <div className="absolute inset-0 overflow-hidden">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white/30 rounded-full"
                      style={{
                        left: `${20 + i * 30}%`,
                        animation: `floatUp ${3 + i * 0.5}s ease-in-out infinite`,
                        animationDelay: `${i * 0.7}s`
                      }}
                    ></div>
                  ))}
                </div>
              </div>

              <div
                className="absolute left-0 right-0 transition-all duration-500 ease-out pointer-events-none z-10"
                style={{
                  top: `${100 - scrollProgress}%`,
                  willChange: 'top'
                }}
              >
                <div className="relative h-1 bg-primary shadow-lg shadow-primary/50">
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent"
                    style={{
                      animation: 'slideAcross 2s ease-in-out infinite'
                    }}
                  ></div>

                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
                    <div
                      className="w-1.5 h-1.5 bg-primary shadow-lg shadow-primary/50"
                      style={{
                        animation: 'gentlePulse 2s ease-in-out infinite'
                      }}
                    ></div>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                    <div
                      className="w-1.5 h-1.5 bg-primary shadow-lg shadow-primary/50"
                      style={{
                        animation: 'gentlePulse 2s ease-in-out infinite 0.3s'
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="absolute left-0 right-0 transition-all duration-500"
                  style={{ top: `${100 - milestone.progress}%` }}
                >
                  <div className={`relative h-0.5 transition-all duration-500 ${scrollProgress >= milestone.progress
                    ? "bg-primary shadow-md shadow-primary/30"
                    : "bg-border/50"
                    }`}>
                    {scrollProgress >= milestone.progress && (
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                    )}
                  </div>

                  <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 transition-all duration-500 ${scrollProgress >= milestone.progress ? "opacity-100 translate-x-0" : "opacity-40 -translate-x-2"
                    }`}>
                    <div className={`rounded-none px-2 py-1.5 shadow-lg transition-all duration-500 ${scrollProgress >= milestone.progress
                      ? "bg-primary/10 border border-primary/30 backdrop-blur-sm"
                      : "bg-card/80 border border-border/30 backdrop-blur-sm"
                      }`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base flex items-center justify-center">
                          {(() => {
                            const IconComponent = iconMap[milestone.key]
                            return IconComponent ? <IconComponent size={13} className={scrollProgress >= milestone.progress ? "text-primary" : "text-muted-foreground"} /> : milestone.icon
                          })()}
                        </span>
                        <div>
                          <p className={`text-[9px] font-bold transition-colors font-mono uppercase tracking-wider ${scrollProgress >= milestone.progress ? "text-primary" : "text-muted-foreground"
                            }`}>
                            {milestone.label}
                          </p>
                          {scrollProgress >= milestone.progress && (
                            <p className="text-[8px] text-muted-foreground font-mono">
                              {milestone.progress}%
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!(showTooltip && scrollProgress < 20) && (
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-56 bg-card/95 backdrop-blur-md border border-primary/40 rounded-none p-3 shadow-2xl space-y-2">
              <SQLConsole
                key={currentMilestone.key}
                query={currentMilestone.query}
                label={currentMilestone.label}
                layout="desktop"
              />
              <div className="flex justify-center mt-1">
                <div className="text-[8px] text-gray-500 font-mono tabular-nums">
                  {Math.round(scrollProgress)}%
                </div>
              </div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-6 border-l-primary/40"></div>
            </div>
          )}
        </div>

        {showTooltip && scrollProgress < 20 && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-48 bg-primary text-primary-foreground rounded-none p-3 shadow-2xl animate-gentle-bounce font-mono">
            <div className="flex items-center justify-center gap-1.5 mb-1.5 text-xs font-bold text-center uppercase tracking-wider">
              <MousePointerClick size={12} className="animate-pulse" />
              <span>{dictionary.scrollProgress.tooltip.title}</span>
            </div>
            <p className="text-[10px] text-center opacity-90">{dictionary.scrollProgress.tooltip.subtitle}</p>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-6 border-l-primary"></div>
          </div>
        )}
      </div>



      <style jsx>{`
       @keyframes smoothWave {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(15px);
          }
        }

        @keyframes shimmerUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        @keyframes liquidSurface {
          0%, 100% {
            transform: translateY(0px) scaleY(1);
          }
          50% {
            transform: translateY(-3px) scaleY(1.2);
          }
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-200px);
            opacity: 0;
          }
        }

        @keyframes slideAcross {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(100%);
          }
        }

        @keyframes gentlePulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        @keyframes cursorBlink {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .cursor-blink {
          animation: cursorBlink 1s step-start infinite;
        }

        @keyframes gentleBounce {
          0%, 100% {
            transform: translateY(-50%) translateY(0);
          }
          50% {
            transform: translateY(-50%) translateY(-6px);
          }
        }
        .animate-gentle-bounce {
          animation: gentleBounce 2s ease-in-out infinite;
        }
      `}</style>

      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-card/95 backdrop-blur-md border-t border-border/30 shadow-2xl">
          <div className="relative px-4 pt-3 pb-1">
            <div className="relative h-1 bg-border/30 rounded-none overflow-hidden">
              <div
                className="absolute h-full transition-all duration-500 ease-out"
                style={{
                  width: `${scrollProgress}%`,
                  willChange: 'width'
                }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-primary via-accent to-primary"></div>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>

                <div className="absolute right-0 top-0 bottom-0 w-4 bg-linear-to-l from-accent/40 to-transparent blur-sm"></div>
              </div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${milestone.progress}%` }}
                >
                  <div
                    className={`rotate-45 transition-all duration-500 ${scrollProgress >= milestone.progress
                      ? "w-2.5 h-2.5 bg-primary border-2 border-background shadow-lg shadow-primary/50"
                      : "w-1.5 h-1.5 bg-border/50 border border-background"
                      }`}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border/30 px-4 py-2 space-y-1">
            <div className="flex items-center justify-between gap-2 mb-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold font-mono">
                -- {currentMilestone.label}
              </p>
              <p className="text-[10px] font-medium text-muted-foreground/70 tabular-nums font-mono">
                {Math.round(scrollProgress)}%
              </p>
            </div>
            <SQLConsole
              key={`mobile-${currentMilestone.key}`}
              query={currentMilestone.query}
              label={currentMilestone.label}
              layout="mobile"
            />
          </div>
        </div>
      </div>
    </>
  )
}
