export function HudLabel({ label, align = "left" }: { label: string; align?: "left" | "right" }) {
  return (
    <div className={`flex items-center gap-2 pointer-events-none ${align === "right" ? "flex-row-reverse" : ""}`}>
      <div className="w-5 h-px bg-primary/60" />
      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-primary/60">{label}</span>
    </div>
  )
}
