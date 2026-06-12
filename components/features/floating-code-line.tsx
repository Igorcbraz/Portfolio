export function FloatingCodeLine({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none whitespace-nowrap font-mono text-[11px] text-[oklch(0.62_0.22_41.1/0.28)] ${className || ""}`}
    >
      {text}
    </div>
  );
}