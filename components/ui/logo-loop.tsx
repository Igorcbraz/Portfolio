"use client"

import { useEffect, useRef, useState, useMemo } from "react"
import Image from "next/image"

interface Logo {
  src: string
  alt: string
  width?: number
  height?: number
}

interface LogoLoopProps {
  logos: Logo[]
  speed?: number
  className?: string
}

export function LogoLoop({
  logos,
  speed = 55,
  className = "",
}: LogoLoopProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const repeats = 4
  const allLogos = useMemo(() => Array.from({ length: repeats }, () => logos).flat(), [logos])
  const duration = useMemo(() => (logos.length * repeats * 160) / speed, [logos.length, speed])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { rootMargin: "200px 0px" } // Starts playing slightly before coming into view
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <div
        className="absolute left-0 top-0 h-full w-28 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, var(--background) 0%, transparent 100%)" }}
      />
      <div
        className="absolute right-0 top-0 h-full w-28 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, var(--background) 0%, transparent 100%)" }}
      />
      <div
        className="flex items-center transform-gpu logo-loop-track-hover-pause"
        style={{
          width: "max-content",
          animationName: "logo-marquee",
          animationDuration: `${duration}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
          animationPlayState: isVisible ? "running" : "paused",
          willChange: "transform",
        }}
      >
        {allLogos.map((logo, i) => (
          <LogoItem key={i} logo={logo} />
        ))}
      </div>
    </div>
  )
}

function LogoItem({ logo }: { logo: Logo }) {
  return (
    <div className="group mx-10 shrink-0 flex items-center justify-center select-none cursor-default transform-gpu backface-hidden">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width ?? 120}
        height={logo.height ?? 44}
        className="object-contain shrink-0 transform-gpu grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-90 transition-all duration-400 mix-blend-luminosity group-hover:mix-blend-normal"
        draggable={false}
      />
    </div>
  )
}
