export function StatusBar({ count, label }: { count: number; label: string }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-7 border-t border-[oklch(0.62_0.22_41.1/0.15)] flex items-center px-4 gap-3 bg-[oklch(0.06_0_0/0.6)]">
      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      <span className="text-[9px] font-mono text-primary/60 uppercase tracking-widest">STATUS: ACTIVE</span>
      <div className="flex-1" />
      <span className="text-[9px] font-mono text-[oklch(0.62_0.22_41.1/0.35)] uppercase tracking-widest">{count} {label}</span>
    </div>
  )
}
