"use client"

import { Technology } from "./types"
import { TechCard } from "./tech-card"
import { StatusBar } from "./status-bar"
import { HudLabel } from "./hud-label"

export function FrontendShape({ technologies, isTouchDevice }: { technologies: Technology[]; isTouchDevice: boolean }) {
  return (
    <div className="relative flex flex-col items-center transform-3d">
      <div className="absolute -top-7 left-0">
      </div>

      <div
        className="relative w-[340px] sm:w-[600px] transform-3d"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="relative border-2 border-[oklch(0.62_0.22_41.1/0.35)] bg-[oklch(0.06_0_0)] p-3 sm:p-4 rounded-sm">
          <div className="relative bg-[oklch(0.08_0_0)] border border-[oklch(0.62_0.22_41.1/0.2)] overflow-hidden"
            style={{ aspectRatio: "16/10" }}>

            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(oklch(0.62 0.22 41.1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 41.1) 1px, transparent 1px)`,
                backgroundSize: "36px 36px",
              }}
            />

            <div className="absolute top-0 left-0 right-0 h-8 bg-[oklch(0.10_0_0/0.8)] border-b border-[oklch(0.62_0.22_41.1/0.15)] flex items-center gap-2 px-3">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full border border-[oklch(0.62_0.22_41.1/0.3)] bg-[oklch(0.62_0.22_41.1/0.1)]" />
                <div className="w-2.5 h-2.5 rounded-full border border-[oklch(0.62_0.22_41.1/0.2)] bg-transparent" />
                <div className="w-2.5 h-2.5 rounded-full border border-[oklch(0.62_0.22_41.1/0.2)] bg-transparent" />
              </div>
              <div className="flex-1 h-4 border border-[oklch(0.62_0.22_41.1/0.15)] bg-[oklch(0.06_0_0)] rounded-sm flex items-center px-2">
              </div>
              <span className="text-[8px] font-mono text-[oklch(0.62_0.22_41.1/0.3)] uppercase tracking-widest hidden sm:block">SYS</span>
            </div>

            <div className="hidden sm:block absolute bottom-4 right-4 font-mono text-[oklch(0.62_0.22_41.1/0.07)] text-7xl font-black select-none pointer-events-none leading-none">
              {"</>"}
            </div>

            <div className="absolute inset-0 top-8 grid grid-cols-3 grid-rows-2 gap-2 p-2 sm:p-3">
              {technologies.map((tech, i) => (
                <TechCard key={tech.name} tech={tech} index={i} isTouchDevice={isTouchDevice} />
              ))}
            </div>

            <StatusBar count={technologies.length} label="MODULES" />
          </div>

          <div className="h-6 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full border border-[oklch(0.62_0.22_41.1/0.3)] bg-[oklch(0.62_0.22_41.1/0.06)]" />
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-6 h-8 bg-[oklch(0.10_0_0)] border-x border-[oklch(0.62_0.22_41.1/0.2)]" />
          <div className="w-28 sm:w-40 h-3 border border-t-0 border-[oklch(0.62_0.22_41.1/0.25)] bg-[oklch(0.08_0_0)]" />
        </div>
      </div>

      <div className="mt-2 self-end">
        <HudLabel label="RENDER: ACTIVE" align="right" />
      </div>
    </div>
  )
}
