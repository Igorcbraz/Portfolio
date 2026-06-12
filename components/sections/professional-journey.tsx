"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import { getExperience } from '@/lib/data'
import { useLocale } from "@/contexts/LocaleContext"
import { ArrowLeft, ArrowRight, Server, Database, LayoutTemplate, Network, Blocks, Shield, Users, Terminal, Table } from "lucide-react"

interface JourneyStep {
  startDate: string
  endDate: string | null
  title: string
  company: string
  description: string
  icon: string
  highlights: string[]
}

const DISPLAY_ORDER = [0, 1, 2, 3]

function useDateFormatter(locale: string) {
  return useCallback((startDate: string, endDate: string | null): string => {
    const mPt = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    const mEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const m = locale === 'en' ? mEn : mPt
    if (!startDate) return ''
    const [sy, sm] = startDate.split('-')
    const sf = locale === 'en' ? `${m[+sm - 1]} ${sy}` : `${m[+sm - 1]} de ${sy}`
    if (!endDate) return locale === 'en' ? `${sf} — Present` : `${sf} — o momento`
    const [ey, em] = endDate.split('-')
    const ef = locale === 'en' ? `${m[+em - 1]} ${ey}` : `${m[+em - 1]} de ${ey}`
    return `${sf} — ${ef}`
  }, [locale])
}

function TechIcon({ tech }: { tech: string }) {
  const t = tech.toLowerCase()
  if (t.includes('node') || t.includes('backend') || t.includes('server')) return <Server size={13} />
  if (t.includes('vue') || t.includes('react') || t.includes('quasar') || t.includes('frontend')) return <LayoutTemplate size={13} />
  if (t.includes('sql') || t.includes('mongo') || t.includes('database')) return <Database size={13} />
  if (t.includes('api') || t.includes('rest') || t.includes('webhook')) return <Network size={13} />
  if (t.includes('ci/cd') || t.includes('docker') || t.includes('aws') || t.includes('ocean')) return <Blocks size={13} />
  if (t.includes('test') || t.includes('jest')) return <Shield size={13} />
  if (t.includes('mentor') || t.includes('didática') || t.includes('aula') || t.includes('comunicação')) return <Users size={13} />
  if (t.includes('excel') || t.includes('dados')) return <Table size={13} />
  return <Terminal size={13} />
}

const cardVariants: Variants = {
  enter: (dir: number) => ({
    opacity: 0,
    rotateY: dir * 22,
    x: dir * 60,
    z: -240,
    scale: 0.88,
  }),
  center: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    z: 0,
    scale: 1,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (dir: number) => ({
    opacity: 0,
    rotateY: -dir * 22,
    x: -dir * 60,
    z: -240,
    scale: 0.88,
    transition: { duration: 0.45, ease: [0.36, 0, 0.66, 0] },
  }),
}

export function ProfessionalJourney() {
  const { dictionary, locale } = useLocale()
  const sectionRef = useRef<HTMLElement>(null)
  const sceneRef = useRef<HTMLDivElement>(null)

  const [steps, setSteps] = useState<JourneyStep[]>([])
  const [displayIdx, setDisplayIdx] = useState(0)
  const [dir, setDir] = useState(1)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const formatDate = useDateFormatter(locale)

  useEffect(() => {
    setSteps(getExperience(locale) as JourneyStep[])
  }, [locale])

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const goTo = useCallback((idx: number) => {
    if (idx === displayIdx) return
    setDir(idx > displayIdx ? 1 : -1)
    setDisplayIdx(idx)
  }, [displayIdx])

  const prev = () => goTo(Math.max(0, displayIdx - 1))
  const next = () => goTo(Math.min(DISPLAY_ORDER.length - 1, displayIdx + 1))

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!sceneRef.current || isTouchDevice) return
    const r = sceneRef.current.getBoundingClientRect()
    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2
    setTilt({ x: -ny * 5, y: nx * 5 })
  }

  const loaded = steps.length > 0
  const dataIdx = DISPLAY_ORDER[displayIdx]
  const step = loaded ? steps[dataIdx] : null
  const period = step ? formatDate(step.startDate, step.endDate) : ""
  const stageNum = String(displayIdx + 1).padStart(2, "0")

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-24 overflow-hidden bg-background"
    >
      <div className="absolute inset-0 hero-grid-pattern opacity-100 pointer-events-none" />

      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,var(--background)_100%)]"
      />

      <div
        className="absolute pointer-events-none top-[-10%] right-[-5%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle,oklch(0.62_0.22_41.1/0.13)_0%,transparent_70%)] rounded-full blur-2xl animate-[pulse_6s_ease-in-out_infinite]"
      />

      <div
        className="absolute pointer-events-none bottom-[-15%] left-[-8%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] bg-[radial-gradient(circle,oklch(0.55_0.18_260/0.07)_0%,transparent_70%)] rounded-full blur-[60px] animate-[pulse_8s_ease-in-out_infinite] [animation-delay:2s]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.05 }}
        >
          <p
            className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4 font-display"
          >
            Trajetória
          </p>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight text-foreground font-display"
          >
            {dictionary.journey.title}{" "}
            <span
              className="bg-[linear-gradient(90deg,oklch(0.62_0.22_41.1),oklch(0.82_0.20_75),oklch(0.62_0.22_41.1))] bg-size-[200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] animate-[shimmer_4s_linear_infinite]"
            >
              Profissional
            </span>
          </h2>
        </motion.div>

        <motion.div
          className="flex gap-8 lg:gap-16 items-start"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <aside className="hidden lg:flex flex-col gap-0 shrink-0 pt-2">
            {loaded && DISPLAY_ORDER.map((dataI, navIdx) => {
              const s = steps[dataI]
              const isActive = navIdx === displayIdx
              return (
                <div
                  key={navIdx}
                  className="flex gap-4 py-3.5 cursor-pointer"
                  onClick={() => goTo(navIdx)}
                >
                  <div className="flex flex-col items-center gap-1.5 pt-1">
                    <span
                      className={`text-xs font-bold tabular-nums font-display min-w-[1.6rem] transition-colors duration-300 ${isActive ? "text-primary opacity-100" : "text-muted-foreground opacity-50"
                        }`}
                    >
                      {String(navIdx + 1).padStart(2, "0")}
                    </span>
                    <div
                      className={`flex-1 min-h-11 rounded-full transition-all duration-300 ${isActive ? "w-[3px] bg-primary" : "w-0.5 bg-border"
                        }`}
                    />
                  </div>
                  <div className="flex flex-col justify-center max-w-[180px]">
                    <span
                      className={`text-sm font-semibold leading-tight line-clamp-2 font-display transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      title={s?.title}
                    >
                      {s?.title ?? "—"}
                    </span>
                    <span
                      className="text-[11px] mt-1 leading-none text-muted-foreground/60"
                    >
                      {s?.company} • {s ? formatDate(s.startDate, s.endDate).split("—")[0].trim() : ""}
                    </span>
                  </div>
                </div>
              )
            })}
          </aside>

          <div
            ref={sceneRef}
            className="flex-1 relative min-h-[520px] perspective-distant perspective-origin-[50%_40%]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTilt({ x: 0, y: 0 })}
          >
            <div
              className="relative z-10 transform-3d transition-transform duration-550 ease-out"
              style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              }}
            >
              <AnimatePresence mode="wait" custom={dir}>
                {step && (
                  <motion.div
                    key={`card-${displayIdx}`}
                    custom={dir}
                    variants={cardVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    className="transform-3d"
                  >
                    <div
                      className="relative rounded-2xl overflow-hidden bg-card border border-border flex flex-col h-[480px] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_40px_-10px_rgba(0,0,0,0.5)] transform-[translateZ(0px)] backdrop-blur-xl backdrop-saturate-120"
                    >
                      <div
                        className="absolute select-none pointer-events-none font-display text-[clamp(180px,26vw,320px)] font-extrabold top-[-5%] right-[-5%] leading-[0.85] tracking-[-0.04em] z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,transparent_90%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] tabular-nums"
                      >
                        {stageNum}
                      </div>
                      <div
                        className="absolute top-0 left-0 right-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--primary),transparent)]"
                      />

                      <div className="p-8 sm:p-10 lg:p-12">
                        <p
                          className="text-xs font-semibold uppercase tracking-[0.2em] mb-5 text-primary font-display"
                        >
                          {period}
                        </p>

                        <h3
                          className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-3 text-foreground font-display tracking-[-0.02em]"
                        >
                          {step.title}
                        </h3>

                        <p
                          className="text-base sm:text-lg font-semibold mb-8 text-muted-foreground"
                        >
                          {step.company}
                        </p>

                        <div
                          className="mb-8 h-px bg-[linear-gradient(90deg,var(--border),transparent)]"
                        />

                        <div className="flex-1 overflow-y-auto scrollbar-none mb-6 relative z-10">
                          <p
                            className="text-sm sm:text-base leading-[1.85] max-w-2xl text-muted-foreground/80"
                          >
                            {step.description}
                          </p>
                        </div>

                        <div className="scrollbar-none overflow-x-auto mt-auto shrink-0 relative z-10 border-t border-border/50 pt-4">
                          <div className="flex flex-wrap gap-2 pb-1">
                            {step.highlights.map((tech, i) => (
                              <span
                                key={i}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 font-display tracking-[0.02em]"
                              >
                                <TechIcon tech={tech} />
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={prev}
                  disabled={displayIdx === 0}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  aria-label="Anterior"
                >
                  <ArrowLeft size={15} />
                </button>

                <button
                  onClick={next}
                  disabled={displayIdx === DISPLAY_ORDER.length - 1}
                  className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 cursor-pointer disabled:opacity-25 disabled:cursor-not-allowed bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/50"
                  aria-label="Próximo"
                >
                  <ArrowRight size={15} />
                </button>
              </div>

              <p
                className="text-xs tabular-nums text-muted-foreground ml-auto font-display"
              >
                <span className="text-primary">{stageNum}</span>
                <span> / {String(DISPLAY_ORDER.length).padStart(2, "0")}</span>
              </p>
            </div>

            <div className="lg:hidden mt-8 flex flex-col gap-1">
              {loaded && DISPLAY_ORDER.map((dataI, navIdx) => {
                const s = steps[dataI]
                const isActive = navIdx === displayIdx
                return (
                  <button
                    key={navIdx}
                    onClick={() => goTo(navIdx)}
                    className={`flex items-center gap-3 text-left py-2.5 px-3 rounded-xl transition-colors duration-150 cursor-pointer border ${isActive ? "bg-accent border-border" : "bg-transparent border-transparent"
                      }`}
                  >
                    <span
                      className={`text-[10px] font-bold tabular-nums shrink-0 font-display ${isActive ? 'text-primary' : 'text-muted-foreground/50'}`}
                    >
                      {String(navIdx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-semibold line-clamp-1 font-display ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                      >
                        {s?.title}
                      </span>
                      <span className={`text-[10px] ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/50'}`}>
                        {s?.company}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
