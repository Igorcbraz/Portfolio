"use client"

import { useRef, useEffect, useState } from "react"
import { useInView } from "framer-motion"

interface CountUpProps {
  end: number
  start?: number
  duration?: number // ms
  delay?: number // ms
  suffix?: string
  prefix?: string
  className?: string
  once?: boolean
  threshold?: number
}

export function CountUp({
  end,
  start = 0,
  duration = 1800,
  delay = 0,
  suffix = "",
  prefix = "",
  className = "",
  once = true,
  threshold = 0.2,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const [count, setCount] = useState(start)
  const hasRun = useRef(false)
  const prevEndRef = useRef(end)

  if (prevEndRef.current !== end) {
    hasRun.current = false
    prevEndRef.current = end
  }

  useEffect(() => {
    if (!isInView) return
    if (once && hasRun.current) return
    hasRun.current = true

    let raf: number
    let startTime: number | null = null

    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

    const delayTimer = setTimeout(() => {
      const animate = (now: number) => {
        if (!startTime) startTime = now
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        setCount(Math.floor(easeOutQuart(progress) * (end - start) + start))
        if (progress < 1) raf = requestAnimationFrame(animate)
        else setCount(end)
      }
      raf = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(delayTimer)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [isInView, end, start, duration, delay, once])

  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-live="polite">
      {prefix}{count}{suffix}
    </span>
  )
}

export default CountUp
