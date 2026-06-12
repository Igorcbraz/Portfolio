"use client"

import { useState } from "react"
import { Technology } from "./types"
import { StatusBar } from "./status-bar"
import { HudLabel } from "./hud-label"

function DevOpsNode({ tech, isTouchDevice, isCenter }: { tech: Technology; isTouchDevice: boolean; isCenter?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const Icon = tech.icon

  return (
    <div
      onMouseEnter={() => !isTouchDevice && setHovered(true)}
      onMouseLeave={() => !isTouchDevice && setHovered(false)}
      onClick={() => isTouchDevice && setHovered(h => !h)}
      className="relative flex flex-col items-center justify-center gap-2 cursor-pointer transform-3d transition-all duration-200"
      style={{
        width: isCenter ? 100 : 90,
        height: isCenter ? 100 : 90,
        transform: hovered ? "translateZ(36px) scale(1.08)" : "translateZ(0) scale(1)",
      }}
    >
      <div className="absolute inset-0 z-100 bg-transparent" />

      <div className={`absolute inset-0 border-2 transition-all duration-200 ${hovered
        ? "border-primary bg-[oklch(0.62_0.22_41.1/0.14)] shadow-[0_0_24px_oklch(0.62_0.22_41.1/0.25)]"
        : isCenter
          ? "border-[oklch(0.62_0.22_41.1/0.5)] bg-[oklch(0.62_0.22_41.1/0.06)]"
          : "border-[oklch(0.62_0.22_41.1/0.25)] bg-[oklch(0.06_0_0/0.9)]"
        }`} />

      <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 transition-all duration-200 ${hovered ? "border-primary" : "border-transparent"}`} />
      <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 transition-all duration-200 ${hovered ? "border-primary" : "border-transparent"}`} />
      <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 transition-all duration-200 ${hovered ? "border-primary" : "border-transparent"}`} />
      <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 transition-all duration-200 ${hovered ? "border-primary" : "border-transparent"}`} />

      <div className="relative">
        <Icon className={`w-7 h-7 sm:w-9 sm:h-9 relative z-10 transition-all duration-200 ${hovered ? "text-primary" : isCenter ? "text-primary/70" : "text-muted-foreground/60"}`} />
        {hovered && <div className="absolute inset-0 blur-lg bg-primary/50 scale-150 pointer-events-none" />}
      </div>

      <span className={`relative z-10 text-[9px] font-mono uppercase tracking-widest text-center leading-tight transition-all duration-200 ${hovered ? "text-primary" : "text-muted-foreground/50"}`}>
        {tech.name}
      </span>
    </div>
  )
}

export function DevOpsShape({ technologies, isTouchDevice }: { technologies: Technology[]; isTouchDevice: boolean }) {
  const [docker, aws, git, ghActions] = technologies

  return (
    <div className="relative transform-3d">
      <div className="absolute -top-7 left-0">
      </div>

      <div
        className="relative w-[320px] sm:w-[560px] h-[300px] sm:h-[380px]"
        style={{ transform: "translateZ(16px)" }}
      >
        <div className="absolute inset-0 border border-[oklch(0.62_0.22_41.1/0.2)] bg-[oklch(0.07_0_0/0.85)] backdrop-blur-xl" />

        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(oklch(0.62 0.22 41.1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 41.1) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent,oklch(0.62_0.22_41.1/0.5),transparent)]" />

        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <span className="text-[9px] font-mono text-[oklch(0.62_0.22_41.1/0.5)] uppercase tracking-widest">BUILD → TEST → DEPLOY</span>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary animate-pulse" />
            <span className="text-[8px] font-mono text-primary/60 uppercase tracking-widest">RUNNING</span>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-0">
            {docker && <DevOpsNode tech={docker} isTouchDevice={isTouchDevice} />}

            <div className="relative h-px w-8 sm:w-12 bg-[oklch(0.62_0.22_41.1/0.3)] shrink-0">
              <div className="absolute -inset-y-0.5 left-0 right-0 bg-[linear-gradient(to_right,oklch(0.62_0.22_41.1/0.1),oklch(0.62_0.22_41.1/0.4),oklch(0.62_0.22_41.1/0.1))]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-[oklch(0.62_0.22_41.1/0.5)]" />
            </div>

            <div className="flex flex-col items-center gap-0 shrink-0">
              {git && <DevOpsNode tech={git} isTouchDevice={isTouchDevice} isCenter />}

              <div className="relative w-px h-6 bg-[oklch(0.62_0.22_41.1/0.3)]">
                <div className="absolute -inset-x-0.5 top-0 bottom-0 bg-[linear-gradient(to_bottom,oklch(0.62_0.22_41.1/0.1),oklch(0.62_0.22_41.1/0.4),oklch(0.62_0.22_41.1/0.1))]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-[6px] border-transparent border-t-[oklch(0.62_0.22_41.1/0.5)]" />
              </div>

              {ghActions && <DevOpsNode tech={ghActions} isTouchDevice={isTouchDevice} isCenter />}
            </div>

            <div className="relative h-px w-8 sm:w-12 bg-[oklch(0.62_0.22_41.1/0.3)] shrink-0">
              <div className="absolute -inset-y-0.5 left-0 right-0 bg-[linear-gradient(to_right,oklch(0.62_0.22_41.1/0.1),oklch(0.62_0.22_41.1/0.4),oklch(0.62_0.22_41.1/0.1))]" />
              <div className="absolute top-1/2 right-0 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-[6px] border-transparent border-l-[oklch(0.62_0.22_41.1/0.5)]" />
            </div>

            {aws && <DevOpsNode tech={aws} isTouchDevice={isTouchDevice} />}
          </div>
        </div>

        <StatusBar count={technologies.length} label="SERVICES" />
      </div>

      <div className="mt-2 self-end flex justify-end">
        <HudLabel label="PIPELINE: ACTIVE" align="right" />
      </div>
    </div>
  )
}
