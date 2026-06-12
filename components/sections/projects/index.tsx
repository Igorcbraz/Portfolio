"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocale } from "@/contexts/LocaleContext"
import { sendGAEvent } from '@next/third-parties/google'
import { getProjects } from '@/lib/data'
import { useInView } from "@/hooks/use-animations"

import { ScanLine } from "@/components/features/scan-line"
import { ProjectCard } from "./project-card"
import { FilterButton } from "@/components/features/filter-button"
import { Project } from "./types"

export function Projects() {
  const { dictionary, locale } = useLocale()
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.05, triggerOnce: true })

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    setProjects(getProjects(locale) as Project[])
  }, [locale])

  const categories = Array.from(new Set(projects.map((p) => p.category)))
  const filteredProjects = activeCategory ? projects.filter((p) => p.category === activeCategory) : projects

  return (
    <section ref={sectionRef} className="relative min-h-screen py-20 bg-background overflow-hidden">

      <style>{`
        @keyframes prj-scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .prj-scanline {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, oklch(0.62 0.22 41.1 / 0.18), transparent);
          animation: prj-scan 8s linear infinite;
          pointer-events: none;
        }
        @keyframes prj-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .prj-blink { animation: prj-blink 1.2s step-start infinite; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 hero-grid-pattern opacity-100" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,var(--background)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,transparent_30%,var(--background)_90%)]" />

        <motion.div
          className="absolute top-[-5%] left-[5%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] rounded-full blur-[80px] bg-[radial-gradient(circle,oklch(0.62_0.22_41.1/0.12)_0%,transparent_70%)]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute bottom-[-10%] right-[-5%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] rounded-full blur-[80px] bg-[radial-gradient(circle,oklch(0.55_0.18_260/0.07)_0%,transparent_70%)]"
          animate={{ scale: [1, 1.06, 1], opacity: [0.4, 0.75, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        />

        <ScanLine />

        <div className="absolute left-4 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent,oklch(0.62_0.22_41.1/0.12)_30%,oklch(0.62_0.22_41.1/0.12)_70%,transparent)]" />
        <div className="absolute right-4 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent,oklch(0.62_0.22_41.1/0.08)_30%,oklch(0.62_0.22_41.1/0.08)_70%,transparent)]" />

        <motion.div
          className="absolute top-8 left-8 hidden sm:flex flex-col gap-1 opacity-40"
          initial={{ opacity: 0, x: -16 }}
          animate={isInView ? { opacity: 0.4, x: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="text-[9px] font-mono text-primary tracking-widest uppercase">SEC-04 // PRJ</div>
          <div className="text-[9px] font-mono text-muted-foreground tracking-widest">RENDER MODE: GRID</div>
          <div className="text-[9px] font-mono text-muted-foreground tracking-widest flex items-center gap-1">
            <span>STATUS:</span>
            <span className="text-primary prj-blink">ACTIVE</span>
          </div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-8 hidden sm:flex flex-col items-end gap-1 opacity-30"
          initial={{ opacity: 0, x: 16 }}
          animate={isInView ? { opacity: 0.3, x: 0 } : {}}
          transition={{ delay: 0.7, duration: 0.8 }}
        >
          <div className="w-px h-16 bg-[linear-gradient(to_bottom,oklch(0.62_0.22_41.1/0.6),transparent)]" />
          <div className="text-[9px] font-mono text-primary tracking-widest uppercase rotate-0">PORTFOLIO.PROJECTS</div>
          <div className="text-[9px] font-mono text-muted-foreground/60 tracking-widest">v2.0 // 2026</div>
        </motion.div>

        <div className="absolute left-[8%] top-1/3 hidden xl:block pointer-events-none opacity-10">
          <div className="relative w-8 h-8">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-primary" />
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary" />
            <div className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 border border-primary rounded-full" />
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex items-center gap-3 mb-5"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <div className="w-8 h-px bg-primary" />
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.25em] font-display">
              {dictionary.projects.sectionLabel}
            </span>
          </motion.div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground font-display leading-[0.95] mb-6">
            <motion.span
              className="inline-block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {dictionary.projects.title}
            </motion.span>{" "}
            <motion.span
              className="inline-block bg-[linear-gradient(90deg,oklch(0.62_0.22_41.1),oklch(0.82_0.20_75),oklch(0.62_0.22_41.1))] bg-size-[200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] animate-[shimmer_4s_linear_infinite]"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {dictionary.projects.titleHighlight}
            </motion.span>
          </h2>

          <motion.p
            className="text-base text-muted-foreground max-w-xl leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            {dictionary.projects.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.65, duration: 0.6 }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />

          <div className="lg:hidden overflow-x-auto scrollbar-none pb-px">
            <div className="flex gap-0 min-w-max">
              <FilterButton
                label={dictionary.projects.all}
                active={activeCategory === null}
                onClick={() => {
                  sendGAEvent('event', 'projects_all_click', { label: 'all' })
                  setActiveCategory(null)
                }}
              />
              {categories.map((cat) => (
                <FilterButton
                  key={cat}
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => {
                    sendGAEvent('event', 'projects_category_click', { label: cat })
                    setActiveCategory(cat)
                  }}
                />
              ))}
            </div>
          </div>

          <div className="hidden lg:flex gap-0 pb-px">
            <FilterButton
              label={dictionary.projects.all}
              active={activeCategory === null}
              onClick={() => {
                sendGAEvent('event', 'projects_all_click', { label: 'all' })
                setActiveCategory(null)
              }}
            />
            {categories.map((cat, idx) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7 + idx * 0.06 }}
              >
                <FilterButton
                  label={cat}
                  active={activeCategory === cat}
                  onClick={() => {
                    sendGAEvent('event', 'projects_category_click', { label: cat })
                    setActiveCategory(cat)
                  }}
                />
              </motion.div>
            ))}
          </div>

          <div className="absolute right-0 bottom-2 hidden sm:flex items-center gap-2 text-[10px] font-mono text-muted-foreground/50">
            <span className="text-primary prj-blink">■</span>
            <span>{filteredProjects.length} PROJECTS</span>
          </div>
        </motion.div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeCategory ?? "all"}
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="grid sm:grid-cols-2 gap-6">
              {filteredProjects.map((project, i) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  idx={i}
                  isInView={isInView}
                  isFeatured={false}
                  dictionary={dictionary}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="mt-16 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          <div className="flex-1 h-px bg-[linear-gradient(to_right,oklch(0.62_0.22_41.1/0.4),transparent)]" />
          <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest uppercase shrink-0">
            END // SEC-04
          </span>
          <div className="flex-1 h-px bg-[linear-gradient(to_left,oklch(0.62_0.22_41.1/0.4),transparent)]" />
        </motion.div>
      </div>
    </section>
  )
}
