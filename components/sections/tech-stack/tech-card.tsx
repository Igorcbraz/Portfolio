"use client"

import { useState } from "react"
import { Technology } from "./types"

export function TechCard({ tech, index, isTouchDevice }: { tech: Technology; index: number; isTouchDevice: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = tech.icon

  return (
    <div
      onMouseEnter={() => !isTouchDevice && setHovered(true)}
      onMouseLeave={() => !isTouchDevice && setHovered(false)}
      onClick={() => isTouchDevice && setHovered(h => !h)}
      className="relative flex flex-col items-center justify-center gap-2.5 p-4 cursor-pointer transition-all duration-200"
    >
      <div className="absolute inset-0 z-100 bg-transparent" />
      <div className={`absolute inset-0 transition-all duration-200 border ${hovered
        ? "border-primary/50 bg-[oklch(0.62_0.22_41.1/0.1)] shadow-[0_0_20px_oklch(0.62_0.22_41.1/0.15)]"
        : "border-[oklch(0.62_0.22_41.1/0.14)] bg-[oklch(0.62_0.22_41.1/0.03)]"
        }`} />

      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-all duration-200 ${hovered ? "border-primary opacity-100" : "border-primary/0 opacity-0"}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-all duration-200 ${hovered ? "border-primary opacity-100" : "border-primary/0 opacity-0"}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-all duration-200 ${hovered ? "border-primary opacity-100" : "border-primary/0 opacity-0"}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-all duration-200 ${hovered ? "border-primary opacity-100" : "border-primary/0 opacity-0"}`} />

      <span className="absolute top-1.5 right-2 text-[8px] font-mono text-[oklch(0.62_0.22_41.1/0.35)]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative">
        <Icon className={`relative z-10 w-8 h-8 sm:w-10 sm:h-10 transition-all duration-200 ${hovered ? "text-primary" : "text-muted-foreground/70"}`} />
        {hovered && (
          <div className="absolute inset-0 blur-lg bg-primary/40 scale-150 pointer-events-none" />
        )}
      </div>

      <span className={`relative z-10 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-center leading-tight transition-all duration-200 ${hovered ? "text-primary" : "text-muted-foreground/50"}`}>
        {tech.name}
      </span>

      {hovered && (
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse pointer-events-none" />
      )}
    </div>
  )
}
