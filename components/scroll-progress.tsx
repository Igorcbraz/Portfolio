"use client"

import { useEffect, useState } from "react"
import { useLocale } from "@/contexts/LocaleContext"

export function ScrollProgress() {
  const { dictionary } = useLocale()

  const staticMilestones = [
    { key: 'start', progress: 0, icon: '👋' },
    { key: 'know', progress: 15, icon: '✨' },
    { key: 'journey', progress: 30, icon: '🚀' },
    { key: 'projects', progress: 50, icon: '💼' },
    { key: 'tech', progress: 70, icon: '⚡' },
    { key: 'contact', progress: 90, icon: '🎯' },
    { key: 'end', progress: 100, icon: '🌟' },
  ]

  const milestones = staticMilestones.map((s) => ({
    progress: s.progress,
    icon: s.icon,
    label: dictionary.scrollProgress.milestones[s.key].label,
    message: dictionary.scrollProgress.milestones[s.key].message,
  }))

  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentMilestone, setCurrentMilestone] = useState(milestones[0])
  const [showTooltip, setShowTooltip] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight - windowHeight
      const scrolled = window.scrollY
      const progress = Math.min(100, Math.max(0, (scrolled / documentHeight) * 100))

      setScrollProgress(progress)

      const current = [...milestones].reverse().find(m => progress >= m.progress) || milestones[0]
      setCurrentMilestone(current)

      if (scrolled > 100 && showTooltip) {
        setShowTooltip(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener("scroll", handleScroll)
  }, [showTooltip])

  return (
    <>
      <div className="hidden lg:flex fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-50 group">
        <div className="relative">
          <div className="relative transition-all duration-300 w-6 sm:w-7">
            <div className="relative h-[50vh] bg-card/90 backdrop-blur-md border border-border/40 rounded-2xl shadow-xl overflow-hidden">
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
                      className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50"
                      style={{
                        animation: 'gentlePulse 2s ease-in-out infinite'
                      }}
                    ></div>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                    <div
                      className="w-2 h-2 bg-primary rounded-full shadow-lg shadow-primary/50"
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
                  <div className={`relative h-0.5 transition-all duration-500 ${
                    scrollProgress >= milestone.progress
                      ? "bg-primary shadow-md shadow-primary/30"
                      : "bg-border/50"
                  }`}>
                    {scrollProgress >= milestone.progress && (
                      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent animate-pulse"></div>
                    )}
                  </div>

                  <div className={`absolute left-full ml-2 top-1/2 -translate-y-1/2 transition-all duration-500 ${
                    scrollProgress >= milestone.progress ? "opacity-100 translate-x-0" : "opacity-40 -translate-x-2"
                  }`}>
                    <div className={`rounded-lg px-2 py-1.5 shadow-lg transition-all duration-500 ${
                      scrollProgress >= milestone.progress
                        ? "bg-primary/10 border border-primary/30 backdrop-blur-sm"
                        : "bg-card/80 border border-border/30 backdrop-blur-sm"
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{milestone.icon}</span>
                        <div>
                          <p className={`text-[10px] font-bold transition-colors ${
                            scrollProgress >= milestone.progress ? "text-primary" : "text-muted-foreground"
                          }`}>
                            {milestone.label}
                          </p>
                          {scrollProgress >= milestone.progress && (
                            <p className="text-[8px] text-muted-foreground">
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
            <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 w-40 bg-card/95 backdrop-blur-md border border-primary/30 rounded-xl p-2.5 shadow-2xl">
              <div className="text-center space-y-1.5">
                <div className="text-2xl animate-bounce">{currentMilestone.icon}</div>
                <div>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-semibold">
                    {currentMilestone.label}
                  </p>
                  <p className="text-[11px] text-foreground font-medium mt-1">{currentMilestone.message}</p>
                </div>
                <div className="pt-1.5 border-t border-border/30">
                  <p className="text-xl font-bold text-primary tabular-nums">{Math.round(scrollProgress)}%</p>
                  <p className="text-[8px] text-muted-foreground uppercase tracking-wider mt-0.5">{dictionary.scrollProgress.explored}</p>
                </div>
              </div>

              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-l-6 border-l-primary/30"></div>
            </div>
          )}
        </div>

        {showTooltip && scrollProgress < 20 && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 w-48 bg-primary text-primary-foreground rounded-lg p-3 shadow-2xl animate-bounce">
            <p className="text-sm font-bold text-center mb-1.5">{dictionary.scrollProgress.tooltip.title}</p>
            <p className="text-xs text-center opacity-95">{dictionary.scrollProgress.tooltip.subtitle}</p>
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
      `}</style>

      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="bg-card/95 backdrop-blur-md border-t border-border/30 shadow-2xl">
          <div className="relative px-4 pt-3 pb-2">
            <div className="relative h-2 bg-border/30 rounded-full overflow-hidden">
              <div
                className="absolute h-full transition-all duration-500 ease-out"
                style={{
                  width: `${scrollProgress}%`,
                  willChange: 'width'
                }}
              >
                <div className="absolute inset-0 bg-linear-to-r from-primary via-accent to-primary"></div>
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>

                <div className="absolute right-0 top-0 bottom-0 w-4 `bg-linear-to-l from-accent/40 to-transparent blur-sm"></div>
              </div>

              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500"
                  style={{ left: `${milestone.progress}%` }}
                >
                  <div
                    className={`rounded-full transition-all duration-500 ${
                      scrollProgress >= milestone.progress
                        ? "w-3 h-3 bg-primary border-2 border-background shadow-lg shadow-primary/50"
                        : "w-1.5 h-1.5 bg-border/50 border border-background"
                    }`}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border/30 px-4 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="text-xl shrink-0">{currentMilestone.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{currentMilestone.message}</p>
                <p className="text-[9px] text-muted-foreground">{currentMilestone.label}</p>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-lg font-bold text-primary tabular-nums">{Math.round(scrollProgress)}%</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
