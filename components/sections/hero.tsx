"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { analytics } from "@/lib/analytics"
import { useUser } from "@/contexts/UserContext"
import { useLocale } from "@/contexts/LocaleContext"
import { CountUp } from "@/components/ui/count-up"
import { BlurText } from "@/components/ui/blur-text"
import { ScanLine } from "lucide-react"

const Shape3d = dynamic(() => import("@/components/features/3d-shape").then(m => m.Shape3d), {
  ssr: false,
  loading: () => null,
})

const Aurora = dynamic(() => import("@/components/features/aurora"), { ssr: false })
const DotField = dynamic(() => import("@/components/features/dot-field"), { ssr: false })

const HeroPhoto = dynamic(() => import("@/components/features/hero-photo").then(m => m.HeroPhoto))

export function Hero() {
  const [isDesktopViewport, setIsDesktopViewport] = useState(false)
  const [isShapeReady, setIsShapeReady] = useState(false)

  const imageContainerRef = useRef<HTMLDivElement>(null)
  const [scanTrigger, setScanTrigger] = useState(0)
  const { userData } = useUser()
  const { dictionary } = useLocale()
  const [headlinePrefix, , headlineSuffix] = dictionary.hero.greeting.split("Igor")

  const DEBUG_ALIGNMENT = false // TEMPORARY DEBUG ALIGNMENT MODE

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
    analytics.trackClick(dictionary.hero.knowMeBetter, "hero_scroll")
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  const scrollToContact = () => {
    analytics.trackClick(dictionary.hero.contactMe, "hero_contact")
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="absolute inset-0">
        <DotField
          dotRadius={1.2}
          dotSpacing={22}
          cursorRadius={180}
          bulgeOnly={true}
          bulgeStrength={45}
          glowRadius={120}
          waveAmplitude={2.5}
          gradientFrom="rgba(200, 92, 0, 0.18)"
          gradientTo="rgba(180, 100, 30, 0.10)"
          glowColor="#0d0d0d"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 55%, black 100%)",
        }}
      >
        <Aurora
          colorStops={["#b84a00", "#c87820", "#2e2870"]}
          amplitude={0.75}
          blend={0.30}
          speed={0.3}
          className="w-full h-full"
        />
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 90% 65% at 50% 0%, transparent 35%, var(--background) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "40%",
          background:
            "linear-gradient(to top, var(--background) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex-1 flex items-center w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
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
                <BlurText
                  text={dictionary.hero.description}
                  animateBy="words"
                  direction="top"
                  delay={600}
                  stepDelay={40}
                  className="text-muted-foreground"
                />
              </p>

              <div className="hero-animate-4 flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={scrollToNextSection}
                  className="group relative overflow-hidden cursor-pointer cursor-target"
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
                  className="group cursor-pointer cursor-target"
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
                      <CountUp
                        end={stat.number}
                        suffix="+"
                        duration={1800}
                        delay={index * 150}
                        threshold={0.3}
                      />
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
              <div
                ref={imageContainerRef}
                className="relative w-[540px] h-[580px] flex items-end justify-center overflow-visible lg:-translate-y-10 select-none"
              >
                <div
                  className="absolute inset-0 w-full h-full flex items-end justify-center pointer-events-none"
                  style={{ opacity: DEBUG_ALIGNMENT ? 0.5 : 1 }}
                >
                  <HeroPhoto />
                </div>

                {isDesktopViewport && isShapeReady ? (
                  <>
                    <div
                      className="absolute bottom-0 -left-10 w-[620px] h-[660px] pointer-events-none z-30"
                      style={{ opacity: 1.0 }}
                    >
                      <Shape3d className="w-full h-full relative overflow-visible" scanTrigger={scanTrigger} />
                    </div>

                    <button
                      onClick={() => setScanTrigger(prev => prev + 1)}
                      className="absolute bottom-6 right-6 z-50 p-2.5 sm:p-3 bg-black/55 backdrop-blur-md text-primary hover:bg-primary hover:text-black hover:border-primary transition-all duration-300 cursor-pointer cursor-target rounded-full flex items-center justify-center"
                      title={dictionary.hero.scanProfile}
                      aria-label={dictionary.hero.scanProfile}
                    >
                      <ScanLine className="w-4.5 h-4.5" />
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-24 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-50 hover:opacity-80 transition-opacity cursor-pointer cursor-target z-20"
        onClick={scrollToNextSection}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-display">
          Scroll
        </span>
        <svg className="w-4 h-4 text-muted-foreground animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  )
}
