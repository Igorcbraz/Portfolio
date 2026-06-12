"use client";
import { m } from "framer-motion";
import { getLangBgClass } from "./constants";

export function LanguageBar({
  lang,
  count,
  total,
  idx,
  inView,
}: {
  lang: string;
  count: number;
  total: number;
  idx: number;
  inView: boolean;
}) {
  const pct = (count / total) * 100;

  return (
    <m.div
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
      transition={{
        delay: idx * 0.08 + 0.3,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${getLangBgClass(lang)}`} />
          <span className="text-sm font-medium text-foreground font-display">
            {lang}
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {count} · {pct.toFixed(0)}%
        </span>
      </div>
      <div className="h-1.5 bg-border/30 rounded-full overflow-hidden">
        <m.div
          className={`h-full rounded-full opacity-80 ${getLangBgClass(lang)}`}
          initial={{ width: 0 }}
          animate={inView ? { width: `${pct}%` } : { width: 0 }}
          transition={{
            duration: 1,
            delay: idx * 0.08 + 0.4,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
    </m.div>
  );
}