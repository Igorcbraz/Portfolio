"use client"

import React, { useRef, useEffect } from "react"

interface BorderGlowProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  glowRadius?: number
  glowIntensity?: number
  edgeSensitivity?: number
  borderRadius?: string
  disabled?: boolean
}

export function BorderGlow({
  children,
  className = "",
  glowColor = "oklch(0.62 0.22 41.1)",
  glowRadius = 150,
  glowIntensity = 0.55,
  borderRadius = "rounded-2xl",
  disabled = false,
}: BorderGlowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rectRef = useRef<DOMRect | null>(null)

  const handleMouseEnter = () => {
    if (disabled || !containerRef.current) return
    rectRef.current = containerRef.current.getBoundingClientRect()
    containerRef.current.style.setProperty('--glow-opacity', String(glowIntensity))

    const shadowColor = glowColor.includes('oklch')
      ? glowColor.replace(')', ' / 0.15)')
      : `${glowColor}25`
    containerRef.current.style.boxShadow = `0 0 25px 0 ${shadowColor}`
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || !containerRef.current) return
    if (!rectRef.current) {
      rectRef.current = containerRef.current.getBoundingClientRect()
    }
    const rect = rectRef.current
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    containerRef.current.style.setProperty('--mouse-x', `${x}px`)
    containerRef.current.style.setProperty('--mouse-y', `${y}px`)
  }

  const handleMouseLeave = () => {
    if (!containerRef.current) return
    containerRef.current.style.setProperty('--glow-opacity', '0')
    containerRef.current.style.boxShadow = 'none'
    rectRef.current = null
  }

  useEffect(() => {
    if (disabled && containerRef.current) {
      containerRef.current.style.setProperty('--glow-opacity', '0')
      containerRef.current.style.boxShadow = 'none'
    }
  }, [disabled])

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative p-[1.5px] overflow-hidden ${borderRadius} transition-shadow duration-300 ${className}`}
      style={{
        boxShadow: 'none',
      } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
        style={{
          opacity: 'var(--glow-opacity, 0)',
          background: `radial-gradient(${glowRadius}px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${glowColor}, transparent)`,
        }}
      />

      <div className={`relative z-10 w-full h-full bg-card ${borderRadius} overflow-hidden`}>
        {children}
      </div>
    </div>
  )
}

export default BorderGlow
