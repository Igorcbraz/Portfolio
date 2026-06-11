"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { sendGAEvent } from '@next/third-parties/google'
import { useUser } from "@/contexts/UserContext"
import { useLocale } from "@/contexts/LocaleContext"

const Shape3d = dynamic(() => import("@/components/features/3d-shape").then(m => m.Shape3d), {
  ssr: false,
  loading: () => null,
})

const HeroPhoto = dynamic(() => import("@/components/features/hero-photo").then(m => m.HeroPhoto), {
  ssr: false,
  loading: () => null,
})

type ViewMode = "3d" | "photo"

const VIEW_OPTIONS = [
  {
    mode: "photo" as ViewMode,
    label: "Photo",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    mode: "3d" as ViewMode,
    label: "3D",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
] as const

export function Hero() {
  const [isDesktopViewport, setIsDesktopViewport] = useState(false)
  const [isShapeReady, setIsShapeReady] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("photo")
  const { userData } = useUser()
  const { dictionary } = useLocale()
  const [headlinePrefix, , headlineSuffix] = dictionary.hero.greeting.split("Igor Braz")

  const reposCount = userData?.github.totalRepos || 0
  const starsCount = userData?.github.totalStars || 0
  const yearsCount = userData?.github.yearsExperience || 4

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)")
    const updateShapeVisibility = () => setIsDesktopViewport(media.matches)

    updateShapeVisibility()
    media.addEventListener("change", updateShapeVisibility)

    return () => {
      media.removeEventListener("change", updateShapeVisibility)
    }
  }, [])

  useEffect(() => {
    let timeoutId: number | null = null
    let idleId: number | null = null

    const idleWindow = window as Window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number
      cancelIdleCallback?: (id: number) => void
    }

    if (typeof idleWindow.requestIdleCallback === "function") {
      idleId = idleWindow.requestIdleCallback(() => setIsShapeReady(true), { timeout: 2000 })
    } else {
      timeoutId = window.setTimeout(() => setIsShapeReady(true), 1500)
    }

    return () => {
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId)
      }
      if (idleId !== null && typeof idleWindow.cancelIdleCallback === "function") {
        idleWindow.cancelIdleCallback(idleId)
      }
    }
  }, [])

  const scrollToNextSection = () => {
    sendGAEvent('event', 'hero_me_conheca_click', { label: dictionary.hero.knowMeBetter })
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  const scrollToContact = () => {
    sendGAEvent('event', 'hero_contato_click', { label: dictionary.hero.contactMe })
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span className="text-sm text-primary font-medium">{dictionary.hero.role}</span>
              </div>
              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight">
                  <span>{headlinePrefix}</span>
                  <span className="text-primary">Igor Braz</span>
                  <span>{headlineSuffix}</span>
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground font-normal max-w-2xl leading-relaxed">
                  {dictionary.hero.description}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={scrollToNextSection}
                  className="group relative px-8 py-4 bg-primary text-black rounded-lg font-semibold overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  <span className="relative flex items-center gap-2">
                    {dictionary.hero.knowMeBetter}
                    <span aria-hidden="true">→</span>
                  </span>
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 text-foreground rounded-lg font-semibold border border-border/50 hover:border-primary/50 backdrop-blur-sm cursor-pointer transition-transform hover:scale-[1.02]"
                >
                  {dictionary.hero.contactMe}
                </button>
              </div>
              <div className="flex gap-8 pt-8 border-t border-border/30">
                {[
                  { number: reposCount, label: dictionary.hero.repositories },
                  { number: starsCount, label: dictionary.hero.githubStars },
                  { number: yearsCount, label: dictionary.hero.yearsOfExperience },
                ].map((stat, index) => (
                  <div key={index} className="group cursor-default">
                    <p className="text-2xl font-bold text-primary tabular-nums min-w-[4ch]">
                      {stat.number}+
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="relative hidden lg:flex justify-center items-center lg:min-h-[680px]">
            <div className="relative w-full min-h-[580px] lg:min-h-[680px] flex justify-center items-center overflow-visible lg:-translate-y-10">
              <div
                className={[
                  "absolute inset-0 flex justify-center items-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-center",
                  viewMode === "3d"
                    ? "opacity-100 scale-100 rotate-0 translate-y-0 blur-none pointer-events-auto z-10"
                    : "opacity-0 scale-95 -rotate-2 -translate-y-4 blur-xs pointer-events-none z-0",
                ].join(" ")}
              >
                {isDesktopViewport && isShapeReady ? <Shape3d /> : null}
              </div>
              <div
                className={[
                  "absolute inset-0 flex justify-center lg:items-end items-center transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] origin-center",
                  viewMode === "photo"
                    ? "opacity-100 scale-100 rotate-0 translate-y-0 blur-none pointer-events-auto z-10"
                    : "opacity-0 scale-95 rotate-2 translate-y-4 blur-xs pointer-events-none z-0",
                ].join(" ")}
              >
                <HeroPhoto />
              </div>
              <div
                role="group"
                aria-label="View mode"
                className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-0.5 p-1 rounded-full bg-black/65 border border-white/12 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.4)] pointer-events-auto"
              >
                {VIEW_OPTIONS.map(({ mode, label, icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    aria-pressed={viewMode === mode}
                    title={label}
                    className={[
                      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide border-none cursor-pointer transition-all duration-200",
                      viewMode === mode
                        ? "bg-primary text-black shadow-[0_1px_8px_rgba(163,230,53,0.3)]"
                        : "bg-transparent text-white/50 hover:text-white/80",
                    ].join(" ")}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
