"use client";

export function LanguageFilterBtn({
  active,
  onClick,
  label,
  bgClass,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  bgClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer font-display ${active
          ? "bg-primary text-black"
          : "bg-card/60 border border-border/40 text-muted-foreground hover:border-[oklch(0.62_0.22_41.1/0.45)] hover:text-foreground backdrop-blur-sm"
        }`}
    >
      {bgClass && !active && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${bgClass}`} />
      )}
      {label}
    </button>
  );
}