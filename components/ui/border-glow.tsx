"use client"

import React, { useRef, useState, useEffect } from "react"

interface BorderGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  glowRadius?: number
  glowIntensity?: number
  edgeSensitivity?: number
  borderRadius?: string
}

export function BorderGlow({
  children,
  className = "",
  glowColor = "oklch(0.62 0.22 41.1)",
  glowRadius = 150,
  glowIntensity = 0.55,
  edgeSensitivity = 120,
  borderRadius = "rounded-2xl",
}: BorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const dx = Math.max(-x, 0, x - rect.width)
      const dy = Math.max(-y, 0, y - rect.height)
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < edgeSensitivity) {
        setMousePos({ x, y })
        const factor = 1 - distance / edgeSensitivity
        setOpacity(factor * glowIntensity)
      } else {
        setOpacity(0)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [edgeSensitivity, glowIntensity])

  return (
    <div
      ref={containerRef}
      className={`relative p-[1.5px] overflow-hidden ${borderRadius} transition-shadow duration-300 ${className}`}
      style={{
        boxShadow: opacity > 0 ? `0 0 25px 0 ${glowColor}25` : undefined,
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(${glowRadius}px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent)`,
        }}
      />

      <div className={`relative z-10 w-full h-full bg-card ${borderRadius} overflow-hidden`}>
        {children}
      </div>
    </div>
  )
}

export default BorderGlow
