"use client"

import { m } from "framer-motion"

export function LaserFlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <m.div
        className="absolute h-px w-full bg-[linear-gradient(90deg,transparent,oklch(0.62_0.22_41.1/0.8),transparent)]"
        style={{ top: "15%" }}
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />
      <m.div
        className="absolute h-px w-full bg-[linear-gradient(90deg,transparent,oklch(0.62_0.22_41.1/0.8),transparent)]"
        style={{ top: "85%" }}
        initial={{ x: "100%" }}
        animate={{ x: "-100%" }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
      />
      {[...Array(6)].map((_, i) => (
        <m.div
          key={i}
          className="absolute h-0.5 bg-[oklch(0.62_0.22_41.1)] rounded-full blur-[1px] shadow-[0_0_8px_2px_oklch(0.62_0.22_41.1/0.6)]"
          style={{
            top: `${20 + i * 12}%`,
            width: `${Math.random() * 100 + 50}px`,
            opacity: 0,
          }}
          initial={{ x: "-20vw", opacity: 0 }}
          animate={{ x: "120vw", opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeInOut"
          }}
        />
      ))}

      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_60%_at_50%_50%,black_10%,transparent_80%)]" />
    </div>
  )
}
