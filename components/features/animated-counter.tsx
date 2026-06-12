"use client";
import { useEffect, useState } from "react";

export function AnimatedCounter({
  value,
  inView,
}: {
  value: number;
  inView: boolean;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const end = value;
    if (end === 0) return;
    const duration = 1200;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setDisplay(start);
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <>{display.toLocaleString()}</>;
}