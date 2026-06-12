"use client";
import { m } from "framer-motion";
import { AnimatedCounter } from "./animated-counter";

export interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  inView: boolean;
  delay: number;
}

export function StatCard({ label, value, icon, inView, delay }: StatCardProps) {
  return (
    <m.div
      className="group relative bg-card/60 backdrop-blur-sm border border-[oklch(0.62_0.22_41.1/0.18)] rounded-lg p-5 overflow-hidden cursor-default"
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,oklch(0.62_0.22_41.1/0.08),transparent)]" />

      <div className="relative z-10 flex items-center gap-4">
        <div className="w-11 h-11 rounded-lg bg-[oklch(0.62_0.22_41.1/0.10)] text-primary flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-0.5 font-display">
            {label}
          </p>
          <p className="text-2xl font-bold font-display text-foreground leading-none">
            <AnimatedCounter value={value} inView={inView} />
          </p>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,oklch(0.62_0.22_41.1/0.40),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </m.div>
  );
}