"use client"

import { useEffect, useRef, useState } from "react"
import { useLocale } from "@/contexts/LocaleContext"

export function Shape3d() {
  const [baseRadius, setBaseRadius] = useState(200)
  const [isClient, setIsClient] = useState(false)
  const { dictionary } = useLocale()

  useEffect(() => {
    setIsClient(true)
    const updateRadius = () => {
      if (window.innerWidth < 640) setBaseRadius(100)
      else if (window.innerWidth < 1024) setBaseRadius(140)
      else setBaseRadius(200)
    }
    updateRadius()
    window.addEventListener('resize', updateRadius)
    return () => window.removeEventListener('resize', updateRadius)
  }, [])
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting)
        if (!entry.isIntersecting) {
          setMousePosition({ x: 0, y: 0 })
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isInView || !containerRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()

      const x = (e.clientX - rect.left - rect.width / 2) / rect.width
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height
      setMousePosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isInView])

  return (
    <div
      ref={containerRef}
      className="w-[350px] h-[350px] sm:w-[450px] sm:h-[450px] lg:w-[650px] lg:h-[650px] relative overflow-visible"
      style={{
        perspective: "2000px",
        transformStyle: "preserve-3d",
      }}
    >
      <div
        className="w-full h-full relative"
        style={{
          transformStyle: "preserve-3d",
          transform: `rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 20}deg)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full bg-linear-to-br from-primary/60 via-accent/60 to-primary/60 blur-2xl animate-pulse" />

          <div className="absolute inset-0 w-16 h-16 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-full border-2 border-primary/70 animate-ping" style={{ animationDuration: "2s" }} />
          <div className="absolute inset-2 w-12 h-12 sm:w-20 sm:h-20 lg:w-28 lg:h-28 rounded-full border border-accent/50 animate-spin" style={{ animationDuration: "8s" }} />
          <div className="absolute inset-4 w-8 h-8 sm:w-16 sm:h-16 lg:w-24 lg:h-24 rounded-full border border-primary/30" style={{ animation: "spin-reverse 12s linear infinite" }} />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center backdrop-blur-sm bg-background/20 rounded-full p-2 sm:p-3 lg:p-4">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary drop-shadow-[0_0_15px_currentColor]">
                {dictionary.shape.dev}
              </div>
            </div>
          </div>
        </div>
        {[...Array(8)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 8
          const baseRadius = isClient ? (window.innerWidth < 640 ? 200 : window.innerWidth < 1024 ? 280 : 380) : 280
          const x = isClient ? Math.cos(angle) * baseRadius : 0
          const z = isClient ? Math.sin(angle) * baseRadius : 0

          return (
            <div
              key={`status-${i}`}
              className="absolute top-1/2 left-1/2"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px)`,
              }}
            >
              <div className="w-1 h-10 bg-linear-to-b from-primary to-transparent" style={{ animation: `status-blink ${1 + i * 0.2}s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
            </div>
          )
        })}

        <div
          className="absolute top-1/2 left-1/2 w-[260px] h-[260px] sm:w-[360px] sm:h-[360px] lg:w-[480px] lg:h-[480px] rounded-full border border-primary/30"
          style={{
            transformStyle: "preserve-3d",
            transform: "translate(-50%, -50%) rotateX(75deg)",
            animation: "rotate-ring-1 18s linear infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[280px] h-[280px] sm:w-[390px] sm:h-[390px] lg:w-[520px] lg:h-[520px] rounded-full border border-accent/25"
          style={{
            transformStyle: "preserve-3d",
            transform: "translate(-50%, -50%) rotateY(75deg)",
            animation: "rotate-ring-2 22s linear infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[560px] lg:h-[560px] rounded-full border border-primary/20"
          style={{
            transformStyle: "preserve-3d",
            transform: "translate(-50%, -50%) rotateX(60deg) rotateZ(45deg)",
            animation: "rotate-ring-3 26s linear infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-[320px] h-80 sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] rounded-full border border-accent/15"
          style={{
            transformStyle: "preserve-3d",
            transform: "translate(-50%, -50%) rotateY(60deg) rotateZ(-30deg)",
            animation: "rotate-ring-4 30s linear infinite",
          }}
        />

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-80 sm:w-[450px] sm:h-[450px] lg:w-[600px] lg:h-[600px] pointer-events-none"
          style={{ transformStyle: "preserve-3d", transform: "rotateX(80deg) translateZ(-100px)" }}>
          {[...Array(15)].map((_, i) => (
            <div key={`grid-h-${i}`} className="absolute w-full h-px bg-primary/10" style={{ top: `${i * 100 / 15}%` }} />
          ))}
          {[...Array(15)].map((_, i) => (
            <div key={`grid-v-${i}`} className="absolute h-full w-px bg-primary/10" style={{ left: `${i * 100 / 15}%` }} />
          ))}
        </div>

        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <div
            key={`line-${i}`}
            className="absolute top-1/2 left-1/2 w-32 sm:w-48 lg:w-64 h-px bg-linear-to-r from-primary/50 via-primary/20 to-transparent origin-left"
            style={{
              transformStyle: "preserve-3d",
              transform: `translate(-50%, -50%) rotateZ(${angle}deg)`,
              animation: `pulse-line ${2 + (i % 4) * 0.3}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse pointer-events-none" style={{ animationDelay: "1s" }} />
      </div>

      <style jsx>{`
        @keyframes rotate-particle {
          0% {
            opacity: 0.4;
          }
          50% {
            opacity: 0.8;
          }
          100% {
            opacity: 0.4;
          }
        }

        @keyframes status-blink {
          0%, 100% { opacity: 0.3; height: 2rem; }
          50% { opacity: 1; height: 3rem; }
        }

        @keyframes rotate-ring-1 {
          from { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0deg); }
          to { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg); }
        }

        @keyframes rotate-ring-2 {
          from { transform: translate(-50%, -50%) rotateY(75deg) rotateZ(0deg); }
          to { transform: translate(-50%, -50%) rotateY(75deg) rotateZ(360deg); }
        }

        @keyframes rotate-ring-3 {
          from { transform: translate(-50%, -50%) rotateX(60deg) rotateZ(45deg); }
          to { transform: translate(-50%, -50%) rotateX(60deg) rotateZ(405deg); }
        }

        @keyframes rotate-ring-4 {
          from { transform: translate(-50%, -50%) rotateY(60deg) rotateZ(-30deg); }
          to { transform: translate(-50%, -50%) rotateY(60deg) rotateZ(330deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotateZ(360deg); }
          to { transform: rotateZ(0deg); }
        }

        @keyframes pulse-line {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  )
}
