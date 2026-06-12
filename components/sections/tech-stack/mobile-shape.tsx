"use client"

import { Technology } from "./types"
import { TechCard } from "./tech-card"
import { StatusBar } from "./status-bar"
import { HudLabel } from "./hud-label"

export function MobileShape({ technologies, isTouchDevice }: { technologies: Technology[]; isTouchDevice: boolean }) {
  return (
    <div className="relative transform-3d">
      <div className="absolute -top-7 left-0">
      </div>

      <div
        className="relative w-60 sm:w-[290px] transform-3d"
        style={{ transform: "translateZ(20px)" }}
      >
        <div className="relative border-[3px] border-[oklch(0.62_0.22_41.1/0.5)] bg-[oklch(0.06_0_0)] rounded-4xl overflow-hidden shadow-[0_0_40px_oklch(0.62_0.22_41.1/0.1)]">

          <div className="h-10 flex items-center justify-center relative bg-[oklch(0.07_0_0)]">
            <div className="w-16 h-2 bg-[oklch(0.10_0_0)] rounded-full border border-[oklch(0.62_0.22_41.1/0.2)] flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-0.5 h-1 rounded-full bg-[oklch(0.62_0.22_41.1/0.4)]" />
              ))}
            </div>
            <div className="absolute right-5 w-2.5 h-2.5 rounded-full border border-[oklch(0.62_0.22_41.1/0.4)] bg-[oklch(0.05_0_0)]">
              <div className="absolute inset-[3px] rounded-full bg-[oklch(0.62_0.22_41.1/0.3)]" />
            </div>
          </div>

          <div className="relative bg-[oklch(0.08_0_0)] border-y border-[oklch(0.62_0.22_41.1/0.15)]">
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(oklch(0.62 0.22 41.1) 1px, transparent 1px), linear-gradient(90deg, oklch(0.62 0.22 41.1) 1px, transparent 1px)`,
                backgroundSize: "24px 24px",
              }}
            />

            <div className="flex items-center justify-between px-3 py-1.5 bg-[oklch(0.06_0_0/0.8)]">
              <span className="text-[9px] font-mono text-primary/60">9:41</span>
              <span className="text-[9px] font-mono text-[oklch(0.62_0.22_41.1/0.5)]">MB.OS</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[3, 4, 5].map((h, i) => (
                    <div key={i} style={{ height: h }} className="w-1 bg-primary/60" />
                  ))}
                </div>
                <div className="w-5 h-2.5 border border-[oklch(0.62_0.22_41.1/0.5)] rounded-sm flex items-center px-0.5">
                  <div className="flex-1 h-1.5 bg-primary/70 rounded-sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-3 sm:p-4">
              {technologies.map((tech, i) => (
                <TechCard key={tech.name} tech={tech} index={i} isTouchDevice={isTouchDevice} />
              ))}
            </div>

            <StatusBar count={technologies.length} label="APPS" />
          </div>

          <div className="h-10 flex items-center justify-center bg-[oklch(0.07_0_0)]">
            <div className="w-24 h-1 rounded-full bg-[oklch(0.62_0.22_41.1/0.35)]" />
          </div>
        </div>

        <div className="absolute -right-1.5 top-16 w-1 h-12 border border-[oklch(0.62_0.22_41.1/0.4)] bg-[oklch(0.08_0_0)] rounded-r" />
        <div className="absolute -left-1.5 top-14 w-1 h-8 border border-[oklch(0.62_0.22_41.1/0.4)] bg-[oklch(0.08_0_0)] rounded-l" />
        <div className="absolute -left-1.5 top-24 w-1 h-8 border border-[oklch(0.62_0.22_41.1/0.4)] bg-[oklch(0.08_0_0)] rounded-l" />
      </div>

      <div className="mt-2">
        <HudLabel label={`${technologies.length} FRAMEWORKS`} />
      </div>
    </div>
  )
}
