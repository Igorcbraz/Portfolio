"use client"

import { useState, useRef } from "react"
import { m } from "framer-motion"
import Image from "next/image"
import { ExternalLink } from "lucide-react"
import { Project } from "./types"
import { analytics } from "@/lib/analytics"
import { DecryptedText } from "@/components/ui/decrypted-text"

export function ProjectCard({
  project,
  idx,
  isInView,
  isFeatured = false,
  dictionary,
}: {
  project: Project
  idx: number
  isInView: boolean
  isFeatured?: boolean
  dictionary: any
}) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const cardRectRef = useRef<DOMRect | null>(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = () => {
    setHovered(true)
    if (cardRef.current) {
      cardRectRef.current = cardRef.current.getBoundingClientRect()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRectRef.current || (cardRef.current ? cardRef.current.getBoundingClientRect() : null)
    if (!rect) return
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    const tx = -ny * 4
    const ty = nx * 4
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1200px) rotateX(${tx}deg) rotateY(${ty}deg)`
    }
  }

  const handleMouseLeave = () => {
    cardRectRef.current = null
    setHovered(false)
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)"
    }
  }

  const cardNumber = String(idx + 1).padStart(2, "0")

  return (
    <m.a
      ref={cardRef}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => analytics.trackProjectView(project.title)}
      className="group relative flex flex-col overflow-hidden bg-card border border-border cursor-pointer cursor-target w-full"
      initial={{ opacity: 0, y: 50, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: idx * 0.08 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      layout
    >
      <div
        className="absolute select-none pointer-events-none font-display font-extrabold top-[-4%] right-[-2%] leading-none tracking-[-0.05em] z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,transparent_80%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] tabular-nums"
        style={{ fontSize: isFeatured ? "clamp(160px,20vw,280px)" : "clamp(100px,14vw,180px)" }}
      >
        {cardNumber}
      </div>

      <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,oklch(0.62_0.22_41.1/0.8),transparent)] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 z-30 pointer-events-none" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.62_0.22_41.1/0.06),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10" />

      <div className="absolute inset-0 pointer-events-none z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-[oklch(0.62_0.22_41.1/0.7)]" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-[oklch(0.62_0.22_41.1/0.7)]" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-[oklch(0.62_0.22_41.1/0.7)]" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-[oklch(0.62_0.22_41.1/0.7)]" />
      </div>

      <div className="absolute inset-0 border border-[oklch(0.62_0.22_41.1/0)] group-hover:border-[oklch(0.62_0.22_41.1/0.25)] transition-colors duration-500 pointer-events-none z-20" />

      <div className={`relative overflow-hidden bg-card ${isFeatured ? "aspect-16/6" : "aspect-16/8"}`}>
        <Image
          src={project.image}
          alt={`Projeto ${project.title}: ${project.description}`}
          fill
          sizes={isFeatured ? "(max-width: 768px) 100vw, 100vw" : "(max-width: 768px) 100vw, 50vw"}
          className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
          priority={project.featured}
          loading={project.featured ? "eager" : "lazy"}
          fetchPriority={project.featured ? "high" : "auto"}
          quality={project.featured ? 85 : 75}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.12_0_0/0.95)_0%,oklch(0.12_0_0/0.30)_40%,transparent_100%)] pointer-events-none" />

        <div className="absolute inset-0 bg-[linear-gradient(transparent_49%,oklch(0.62_0.22_41.1/0.03)_50%,transparent_51%)] bg-size-[100%_4px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {project.featured && (
          <m.div
            className="absolute top-4 left-4 inline-flex items-center gap-2 px-3 py-1 bg-[oklch(0.62_0.22_41.1/0.07)] border border-[oklch(0.62_0.22_41.1/0.3)] backdrop-blur-sm z-10"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8 + idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" style={{ boxShadow: "0 0 6px 2px oklch(0.62 0.22 41.1 / 0.6)" }} />
            <span className="text-[10px] font-semibold text-primary font-display tracking-[0.18em] uppercase">
              {dictionary.projects.featured}
            </span>
          </m.div>
        )}

        <div className="absolute bottom-4 left-4 z-10">
          <span className="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] font-display">
            {project.category}
          </span>
        </div>

        <div className="absolute bottom-4 right-4 z-10 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          <ExternalLink size={16} className="text-primary" />
        </div>
      </div>

      <div className="relative z-10 p-5 space-y-3">
        <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors duration-300 font-display leading-tight ${isFeatured ? "text-2xl sm:text-2xl" : "text-lg"}`}>
          {hovered ? <DecryptedText text={project.title} speed={30} className="text-primary" /> : project.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>

        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-[oklch(1_0_0/0.06)]">
            {project.metrics.map((metric, i) => (
              <m.div
                key={i}
                className="text-center group/metric"
                title={metric.description}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4 + idx * 0.08 + i * 0.08 }}
                whileHover={{ scale: 1.08, y: -2 }}
              >
                <p className="text-xl sm:text-2xl font-bold text-primary font-display tracking-tight">
                  {metric.value}
                </p>
                <p className="text-[9px] text-muted-foreground uppercase tracking-widest leading-tight font-mono mt-0.5">
                  {metric.label}
                </p>
                <p className="hidden lg:block text-[9px] text-muted-foreground/60 mt-1 opacity-0 group-hover/metric:opacity-100 transition-opacity font-mono">
                  {metric.description}
                </p>
              </m.div>
            ))}
          </div>
        )}

        {project.highlights && project.highlights.length > 0 && (
          <ul className="space-y-1.5">
            {project.highlights.slice(0, 3).map((highlight, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-0.5 shrink-0 font-mono">▸</span>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="pt-2 border-t border-[oklch(1_0_0/0.06)]">
          <div className="hidden lg:flex flex-wrap gap-1.5">
            {project.technologies.map((tech, i) => (
              <m.span
                key={i}
                className="px-2 py-0.5 bg-card border border-border text-muted-foreground text-[10px] font-mono transition-colors duration-200 hover:bg-[oklch(0.62_0.22_41.1/0.08)] hover:border-[oklch(0.62_0.22_41.1/0.4)] hover:text-primary cursor-default"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.5 + idx * 0.06 + i * 0.025 }}
                whileHover={{ scale: 1.05 }}
              >
                {tech}
              </m.span>
            ))}
          </div>
          <div className="lg:hidden relative">
            <div className="overflow-x-auto scrollbar-none">
              <div className="flex gap-1.5 pb-1">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="shrink-0 px-2 py-0.5 bg-card border border-border text-muted-foreground text-[10px] font-mono">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="absolute top-0 right-0 bottom-0 w-8 bg-[linear-gradient(to_left,var(--card),transparent)] pointer-events-none" />
          </div>
        </div>
      </div>
    </m.a>
  )
}
