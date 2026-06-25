"use client"

import { m } from "framer-motion"

export function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`relative px-5 py-3 text-xs font-semibold font-display uppercase tracking-[0.15em] transition-all duration-200 cursor-pointer cursor-target whitespace-nowrap ${active
        ? "text-background bg-primary"
        : "text-muted-foreground bg-transparent hover:text-foreground hover:bg-[oklch(0.62_0.22_41.1/0.06)]"
        }`}
    >
      {active && (
        <m.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          layoutId="filter-indicator"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}
      {label}
    </button>
  )
}
