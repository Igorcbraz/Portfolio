"use client"

import { useState } from "react"
import { Technology } from "./types"
import { HudLabel } from "./hud-label"

function DatabaseRow({
  tech, index, itemH, total, isTouchDevice,
}: { tech: Technology; index: number; itemH: number; total: number; isTouchDevice: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = tech.icon

  return (
    <div>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => isTouchDevice && setHovered(h => !h)}
        className={`relative flex items-center justify-center gap-5 cursor-pointer transition-all duration-200 ${hovered ? "bg-[oklch(0.62_0.22_41.1/0.1)]" : "bg-transparent hover:bg-[oklch(0.62_0.22_41.1/0.04)]"
          }`}
        style={{ height: `${itemH}px` }}
      >
        {hovered && <div className="absolute inset-0 bg-[oklch(0.62_0.22_41.1/0.04)] blur-xl pointer-events-none" />}

        <span className="text-[10px] font-mono text-[oklch(0.62_0.22_41.1/0.35)] w-6 text-right shrink-0">{String(index + 1).padStart(2, "0")}</span>

        <div className={`w-12 h-12 flex items-center justify-center border shrink-0 transition-all duration-200 ${hovered
          ? "border-primary/50 bg-[oklch(0.62_0.22_41.1/0.12)] shadow-[0_0_16px_oklch(0.62_0.22_41.1/0.2)]"
          : "border-[oklch(0.62_0.22_41.1/0.2)] bg-[oklch(0.05_0_0)]"
          }`}>
          <Icon className={`w-7 h-7 transition-all duration-200 ${hovered ? "text-primary" : "text-muted-foreground/60"}`} />
        </div>

        <span className={`text-base sm:text-lg font-bold font-display w-32 transition-all duration-200 ${hovered ? "text-foreground" : "text-foreground/65"}`}>
          {tech.name}
        </span>

        <div className="ml-auto flex items-center gap-2 pr-4">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${hovered ? "bg-primary animate-pulse shadow-[0_0_6px_oklch(0.62_0.22_41.1)]" : "bg-[oklch(0.62_0.22_41.1/0.2)]"}`} />
          <div className={`text-[9px] font-mono uppercase tracking-widest transition-all duration-200 ${hovered ? "text-primary" : "text-[oklch(0.62_0.22_41.1/0.3)]"}`}>
            {hovered ? "ONLINE" : "STANDBY"}
          </div>
        </div>
      </div>
      {index < total - 1 && (
        <div className="h-px bg-[linear-gradient(to_right,transparent,oklch(0.62_0.22_41.1/0.2),transparent)]" />
      )}
    </div>
  )
}

export function DatabaseShape({ technologies, isTouchDevice }: { technologies: Technology[]; isTouchDevice: boolean }) {
  const itemH = 100

  return (
    <div className="relative transform-3d">
      <div className="absolute -top-7 left-0">
      </div>

      <div
        className="relative w-[300px] sm:w-[400px] h-16 overflow-hidden"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="absolute inset-0 border-t-2 border-x-2 border-[oklch(0.62_0.22_41.1/0.45)] bg-[oklch(0.62_0.22_41.1/0.08)] backdrop-blur-sm rounded-t-[50%]">
          <div className="absolute inset-2 border-t border-x border-[oklch(0.62_0.22_41.1/0.2)] rounded-t-[50%]" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-3 items-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-px h-4 bg-[oklch(0.62_0.22_41.1/0.4)]" />
            ))}
          </div>
          <span className="absolute top-3 right-8 text-[8px] font-mono text-[oklch(0.62_0.22_41.1/0.5)] uppercase tracking-widest">SSD</span>
        </div>
      </div>

      <div
        className="relative w-[300px] sm:w-[400px] border-x-2 border-[oklch(0.62_0.22_41.1/0.35)] bg-[oklch(0.07_0_0/0.9)] backdrop-blur-md overflow-hidden"
        style={{ height: `${technologies.length * itemH}px`, transform: "translateZ(10px)" }}
      >
        <div className="absolute inset-0 flex justify-around opacity-15 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-px h-full bg-[linear-gradient(to_bottom,transparent,oklch(0.62_0.22_41.1),transparent)]" />
          ))}
        </div>

        {technologies.map((tech, index) => (
          <DatabaseRow
            key={tech.name}
            tech={tech}
            index={index}
            itemH={itemH}
            total={technologies.length}
            isTouchDevice={isTouchDevice}
          />
        ))}
      </div>

      <div
        className="relative w-[300px] sm:w-[400px] h-12 overflow-hidden"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="absolute inset-0 border-b-2 border-x-2 border-[oklch(0.62_0.22_41.1/0.45)] bg-[oklch(0.62_0.22_41.1/0.06)] rounded-b-[50%]">
          <div className="absolute inset-2 border-b border-x border-[oklch(0.62_0.22_41.1/0.2)] rounded-b-[50%]" />
        </div>
      </div>

      <div className="mt-2">
        <HudLabel label={`${technologies.length} ENGINES`} />
      </div>
    </div>
  )
}
