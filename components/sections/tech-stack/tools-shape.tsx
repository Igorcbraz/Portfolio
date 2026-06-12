"use client"

import { Technology } from "./types"
import { TechCard } from "./tech-card"
import { StatusBar } from "./status-bar"
import { HudLabel } from "./hud-label"

export function ToolsShape({ technologies, isTouchDevice }: { technologies: Technology[]; isTouchDevice: boolean }) {
  return (
    <div className="relative transform-3d">
      <div className="absolute -top-7 left-0">
      </div>

      <div
        className="relative w-[320px] sm:w-[580px] transform-3d"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="border-2 border-[oklch(0.62_0.22_41.1/0.4)] bg-[oklch(0.06_0_0)] overflow-hidden">

          <div className="h-9 bg-[oklch(0.10_0_0)] border-b border-[oklch(0.62_0.22_41.1/0.2)] flex items-center gap-3 px-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full border border-[oklch(0.62_0.22_41.1/0.5)] bg-[oklch(0.62_0.22_41.1/0.15)]" />
              <div className="w-3 h-3 rounded-full border border-[oklch(0.62_0.22_41.1/0.3)] bg-transparent" />
              <div className="w-3 h-3 rounded-full border border-[oklch(0.62_0.22_41.1/0.3)] bg-transparent" />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[10px] font-mono text-[oklch(0.62_0.22_41.1/0.5)] uppercase tracking-widest">
                ~/portfolio/tools — zsh
              </span>
            </div>
            <div className="flex gap-1">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="w-px h-4 bg-[oklch(0.62_0.22_41.1/0.3)]" />
              ))}
            </div>
          </div>

          <div className="relative bg-[oklch(0.07_0_0)]">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(oklch(0.62 0.22 41.1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 41.1) 1px, transparent 1px)`,
                backgroundSize: "30px 30px",
              }}
            />

            <div className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(to_right,transparent,oklch(0.62_0.22_41.1/0.4),transparent)]" />

            <div className="grid grid-cols-2 gap-3 p-4 sm:p-6">
              {technologies.map((tech, i) => (
                <TechCard key={tech.name} tech={tech} index={i} isTouchDevice={isTouchDevice} />
              ))}
            </div>

            <div className="border-t border-[oklch(0.62_0.22_41.1/0.15)] px-4 py-2.5 flex items-center gap-2 bg-[oklch(0.06_0_0/0.6)]">
              <span className="text-[10px] font-mono text-primary/60">❯</span>
              <span className="text-[10px] font-mono text-[oklch(0.62_0.22_41.1/0.4)]">
                npm run &nbsp;
              </span>
              <span className="text-[10px] font-mono text-primary/70">build</span>
              <div className="w-2 h-3.5 bg-primary/50 animate-pulse ml-0.5" />
            </div>

            <StatusBar count={technologies.length} label="TOOLS" />
          </div>
        </div>
      </div>

      <div className="mt-2 self-end flex justify-end">
        <HudLabel label="ENV: PRODUCTION" align="right" />
      </div>
    </div>
  )
}
