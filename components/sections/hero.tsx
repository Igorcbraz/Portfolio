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
  const [headlinePrefix, , headlineSuffix] = dictionary.hero.greeting.split("Igor")

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
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: "var(--background)" }}
    >

      <div className="absolute inset-0 hero-grid-pattern opacity-100 pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, var(--background) 100%)",
        }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          top: "-10%",
          right: "-5%",
          width: "55vw",
          height: "55vw",
          maxWidth: 700,
          maxHeight: 700,
          background:
            "radial-gradient(circle, oklch(0.62 0.22 41.1 / 0.13) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          animation: "pulse 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-15%",
          left: "-8%",
          width: "50vw",
          height: "50vw",
          maxWidth: 650,
          maxHeight: 650,
          background:
            "radial-gradient(circle, oklch(0.55 0.18 260 / 0.07) 0%, transparent 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          animation: "pulse 8s ease-in-out infinite",
          animationDelay: "2s",
        }}
      />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <div className="flex flex-col gap-0">

            <div className="hero-animate-1 mb-8 inline-flex w-fit items-center gap-2.5 px-4 py-2 rounded-full border border-primary/20 bg-primary/[0.07] backdrop-blur-sm">
              <span
                className="w-2 h-2 rounded-full bg-primary"
                style={{
                  boxShadow: "0 0 6px 2px oklch(0.62 0.22 41.1 / 0.6)",
                  animation: "pulse 2s ease-in-out infinite",
                }}
              />
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: "var(--primary)", fontFamily: "var(--font-display, sans-serif)", letterSpacing: "0.12em" }}
              >
                {dictionary.hero.role}
              </span>
            </div>

            <div className="hero-animate-2 mb-6">
              {headlinePrefix && (
                <p
                  className="text-base sm:text-lg text-muted-foreground mb-3 font-light tracking-wide"
                  style={{ fontFamily: "var(--font-display, sans-serif)" }}
                >
                  {headlinePrefix.trim()}
                </p>
              )}

              <h1
                className="leading-[0.95] tracking-tight mb-4"
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontWeight: 700,
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  lineHeight: 0.95,
                }}
              >
                <span className="block text-foreground/90">Igor</span>
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(90deg, var(--primary) 0%, oklch(0.85 0.22 80) 25%, var(--primary) 50%, oklch(0.75 0.25 50) 75%, var(--primary) 100%)",
                    backgroundSize: "200% auto",
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                    animation: "shimmer 4s linear infinite",
                  }}
                >Costa Braz</span>
              </h1>

              {headlineSuffix && (
                <p
                  className="text-sm sm:text-base text-muted-foreground/70 mt-4 font-light"
                  style={{ fontFamily: "var(--font-display, sans-serif)", letterSpacing: "0.02em" }}
                >
                  {headlineSuffix.trim()}
                </p>
              )}
            </div>

            <p
              className="hero-animate-3 text-base sm:text-[1.05rem] text-muted-foreground leading-relaxed max-w-md mb-10"
              style={{ lineHeight: 1.75 }}
            >
              {dictionary.hero.description}
            </p>

            <div className="hero-animate-4 flex flex-col sm:flex-row gap-3 mb-10">
              <button
                onClick={scrollToNextSection}
                className="group relative overflow-hidden cursor-pointer"
                style={{
                  padding: "14px 32px",
                  background: "var(--primary)",
                  color: "#000",
                  borderRadius: "0",
                  fontWeight: 600,
                  fontSize: "0.925rem",
                  letterSpacing: "0.01em",
                  fontFamily: "var(--font-display, sans-serif)",
                  border: "none",
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"
                    ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 12px 40px -8px oklch(0.62 0.22 41.1 / 0.5)"
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"
                    ; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"
                }}
              >
                <span
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
                    transform: "translateX(-100%)",
                    transition: "transform 400ms ease",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateX(100%)" }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateX(-100%)" }}
                />
                <span className="relative flex items-center justify-center gap-2 w-full">
                  {dictionary.hero.knowMeBetter}
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition: "transform 200ms ease" }}>
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </button>

              <button
                onClick={scrollToContact}
                className="group cursor-pointer"
                style={{
                  padding: "14px 32px",
                  background: "transparent",
                  color: "var(--foreground)",
                  borderRadius: "0",
                  fontWeight: 500,
                  fontSize: "0.925rem",
                  letterSpacing: "0.01em",
                  fontFamily: "var(--font-display, sans-serif)",
                  border: "1px solid oklch(0.95 0 0 / 0.12)",
                  transition: "border-color 200ms ease, background 200ms ease, transform 200ms ease",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = "oklch(0.62 0.22 41.1 / 0.45)"
                  el.style.background = "oklch(0.62 0.22 41.1 / 0.06)"
                  el.style.transform = "translateY(-2px)"
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.borderColor = "oklch(0.95 0 0 / 0.12)"
                  el.style.background = "transparent"
                  el.style.transform = "translateY(0)"
                }}
              >
                {dictionary.hero.contactMe}
              </button>
            </div>

            <div
              className="hero-animate-5 flex gap-0 pt-8"
              style={{ borderTop: "1px solid oklch(0.95 0 0 / 0.07)" }}
            >
              {[
                { number: reposCount, label: dictionary.hero.repositories },
                { number: starsCount, label: dictionary.hero.githubStars },
                { number: yearsCount, label: dictionary.hero.yearsOfExperience },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group cursor-default flex-1"
                  style={{
                    paddingRight: index < 2 ? "2rem" : 0,
                    borderRight: index < 2 ? "1px solid oklch(0.95 0 0 / 0.07)" : "none",
                    marginRight: index < 2 ? "2rem" : 0,
                  }}
                >
                  <p
                    className="tabular-nums"
                    style={{
                      fontFamily: "var(--font-display, sans-serif)",
                      fontWeight: 700,
                      fontSize: "clamp(1.5rem, 3vw, 2rem)",
                      color: "var(--primary)",
                      lineHeight: 1.1,
                      marginBottom: "0.35rem",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stat.number}+
                  </p>
                  <p
                    className="text-xs uppercase tracking-widest transition-colors duration-200 group-hover:text-foreground/70"
                    style={{
                      color: "var(--muted-foreground)",
                      letterSpacing: "0.1em",
                      fontSize: "0.7rem",
                    }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
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

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 hover:opacity-80 transition-opacity cursor-pointer" onClick={scrollToNextSection}>
          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground" style={{ fontFamily: "var(--font-display, sans-serif)" }}>Scroll</span>
          <svg className="w-4 h-4 text-muted-foreground animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  )
}
