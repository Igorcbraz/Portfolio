"use client"

import { useState } from "react"
import { Technology } from "./types"
import { HudLabel } from "./hud-label"

function BackendRow({ tech, index, isTouchDevice }: { tech: Technology; index: number; isTouchDevice: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = tech.icon

  return (
    <div
      onMouseEnter={() => !isTouchDevice && setHovered(true)}
      onMouseLeave={() => !isTouchDevice && setHovered(false)}
      onClick={() => isTouchDevice && setHovered(h => !h)}
      className="relative flex items-center gap-4 px-4 sm:px-5 h-16 sm:h-[72px] cursor-pointer transform-3d transition-all duration-200 group"
      style={{ transform: `translateZ(${index * 12}px) ${hovered ? "translateX(-10px)" : ""}` }}
    >
      <div className="absolute inset-0 z-100 bg-transparent" />

      <div className={`absolute inset-0 border transition-all duration-200 ${hovered
        ? "border-primary/50 bg-[oklch(0.62_0.22_41.1/0.09)] shadow-[inset_0_0_30px_oklch(0.62_0.22_41.1/0.08)]"
        : "border-[oklch(0.62_0.22_41.1/0.14)] bg-[oklch(0.07_0_0/0.9)]"
        }`} />

      <div className={`absolute left-0 top-2 bottom-2 w-1 transition-all duration-200 ${hovered ? "bg-primary shadow-[0_0_8px_oklch(0.62_0.22_41.1/0.6)]" : "bg-[oklch(0.62_0.22_41.1/0.2)]"}`} />

      <div className="absolute top-2 right-3 flex flex-col gap-1 pointer-events-none opacity-40">
        <div className="w-2 h-2 rounded-full border border-[oklch(0.62_0.22_41.1/0.4)]" />
        <div className="w-2 h-2 rounded-full border border-[oklch(0.62_0.22_41.1/0.4)]" />
      </div>

      <span className="relative z-10 text-[11px] font-mono text-[oklch(0.62_0.22_41.1/0.4)] w-7 shrink-0 pl-2">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className={`relative z-10 w-10 h-10 sm:w-12 sm:h-12 shrink-0 flex items-center justify-center border transition-all duration-200 ${hovered
        ? "border-primary/60 bg-[oklch(0.62_0.22_41.1/0.12)]"
        : "border-[oklch(0.62_0.22_41.1/0.18)] bg-[oklch(0.05_0_0)]"
        }`}>
        {hovered && <div className="absolute inset-0 bg-primary/10 blur-md pointer-events-none" />}
        <Icon className={`w-5 h-5 sm:w-6 sm:h-6 relative z-10 transition-all duration-200 ${hovered ? "text-primary" : "text-muted-foreground/60"}`} />
      </div>

      <div className="relative z-10 flex-1 min-w-0">
        <p className={`text-sm sm:text-base font-bold font-display truncate transition-all duration-200 ${hovered ? "text-foreground" : "text-foreground/65"}`}>
          {tech.name}
        </p>
        <div className="flex gap-0.5 mt-1.5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-300 ${hovered
                ? i < 6 ? "bg-primary/80 w-5" : "bg-primary/30 w-5"
                : i < 5 ? "bg-[oklch(0.62_0.22_41.1/0.25)] w-4" : "bg-[oklch(0.62_0.22_41.1/0.08)] w-4"
                }`}
            />
          ))}
        </div>
      </div>

      <div className={`hidden sm:flex relative z-10 items-center gap-2 text-[9px] font-mono px-3 py-1.5 border uppercase tracking-widest transition-all duration-200 shrink-0 ${hovered
        ? "border-primary/50 text-primary bg-[oklch(0.62_0.22_41.1/0.1)]"
        : "border-[oklch(0.62_0.22_41.1/0.18)] text-[oklch(0.62_0.22_41.1/0.4)] bg-transparent"
        }`}>
        {hovered && <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />}
        {hovered ? "ACTIVE" : "READY"}
      </div>
    </div>
  )
}

export function BackendShape({ technologies, isTouchDevice }: { technologies: Technology[]; isTouchDevice: boolean }) {
  return (
    <div className="relative transform-3d">
      <div className="absolute -top-7 left-0">
      </div>

      <div className="relative border-2 border-[oklch(0.62_0.22_41.1/0.35)] bg-[oklch(0.05_0_0)]"
        style={{ transform: "translateZ(10px)" }}>

        <div className="h-8 border-b border-[oklch(0.62_0.22_41.1/0.2)] bg-[oklch(0.08_0_0)] flex items-center justify-between px-4">
          <div className="flex gap-2 items-center">
            <div className="w-2 h-2 bg-primary/60 animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-4 bg-[oklch(0.62_0.22_41.1/0.2)]" style={{ animationDelay: `${i * 0.3}s` }} />
            ))}
          </div>
        </div>

        <div className="flex flex-col divide-y divide-[oklch(0.62_0.22_41.1/0.08)] w-[300px] sm:w-[560px]">
          {technologies.map((tech, index) => (
            <BackendRow key={tech.name} tech={tech} index={index} isTouchDevice={isTouchDevice} />
          ))}
        </div>

        <div className="h-6 border-t border-[oklch(0.62_0.22_41.1/0.2)] bg-[oklch(0.08_0_0)] flex items-center justify-between px-4">
          <span className="text-[8px] font-mono text-[oklch(0.62_0.22_41.1/0.35)] uppercase tracking-widest">
          </span>
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className={`w-3 h-2 border border-[oklch(0.62_0.22_41.1/0.3)] ${i === 0 ? "bg-primary/40" : "bg-transparent"}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 self-end flex justify-end">
        <HudLabel label={`${technologies.length} SERVICES`} align="right" />
      </div>
    </div>
  )
}
