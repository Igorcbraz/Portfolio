"use client"

import { useEffect, useRef, useState } from "react"

export function Shape3d() {
    const [baseRadius, setBaseRadius] = useState(200)
    const [isClient, setIsClient] = useState(false)

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
  const [isMinimized, setIsMinimized] = useState(false)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinimized(true)
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

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

  const techStack = [
    { name: "React", icon: "⚛️", color: "text-cyan-400", layer: 1 },
    { name: "Next.js", icon: "▲", color: "text-gray-100", layer: 1 },
    { name: "TypeScript", icon: "TS", color: "text-blue-500", layer: 1 },
    { name: "Node.js", icon: "◆", color: "text-green-500", layer: 2 },
    { name: "MongoDB", icon: "🍃", color: "text-emerald-500", layer: 2 },
    { name: "PostgreSQL", icon: "🐘", color: "text-blue-400", layer: 2 },
    { name: "Docker", icon: "🐳", color: "text-sky-500", layer: 3 },
    { name: "Git", icon: "⎇", color: "text-orange-500", layer: 3 },
    { name: "AWS", icon: "☁️", color: "text-amber-400", layer: 3 },
    { name: "Tailwind", icon: "💨", color: "text-sky-400", layer: 1 },
    { name: "GraphQL", icon: "◈", color: "text-pink-500", layer: 2 },
    { name: "Redis", icon: "◪", color: "text-red-500", layer: 3 },
  ]

  const metrics = [
    { value: "12+", icon: "💼", color: "text-cyan-400" },
    { value: "200+", icon: "⭐", color: "text-yellow-400" },
    { value: "15+", icon: "⚡", color: "text-purple-400" },
    { value: "5y", icon: "🎯", color: "text-green-400" },
  ]

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
                DEV
              </div>
            </div>
          </div>
        </div>

        {techStack.map((tech, i) => {
          const layerRadius = tech.layer === 1 ? baseRadius : tech.layer === 2 ? baseRadius * 1.3 : baseRadius * 1.6
          const itemsInLayer = techStack.filter(t => t.layer === tech.layer).length
          const indexInLayer = techStack.filter((t, idx) => t.layer === tech.layer && idx <= i).length - 1
          const angle = (indexInLayer * Math.PI * 2) / itemsInLayer

          const x = isClient ? Math.cos(angle) * layerRadius : 0
          const z = isClient ? Math.sin(angle) * layerRadius : 0
          const y = (tech.layer - 2) * 30

          return (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 group"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${-mousePosition.x * 20}deg)`,
              }}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {!isMinimized ? (
                <div className="relative">
                  <div className={`absolute -inset-4 w-20 h-20 rounded-full ${tech.color} opacity-8 blur-3xl animate-pulse`} style={{ animationDuration: `${3 + (i % 3) * 0.5}s` }} />
                  <div className={`absolute -inset-3 w-18 h-18 rounded-full ${tech.color} opacity-5 blur-3xl`} />

                  <div className={`relative w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full backdrop-blur-sm bg-background/40 border border-white/10 shadow-2xl flex items-center justify-center ${tech.color} hover:scale-125 transition-all duration-500 cursor-pointer group/card`}>
                    <div className="text-sm sm:text-lg lg:text-xl" style={{ textShadow: "0 0 8px currentColor" }}>
                      {tech.icon}
                    </div>
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-medium text-foreground/60 opacity-0 group-hover/card:opacity-100 transition-opacity whitespace-nowrap">
                      {tech.name}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative cursor-pointer">
                  <div className={`w-3 h-3 rounded-full ${tech.color} shadow-lg transition-all group-hover:scale-150`}
                       style={{ boxShadow: "0 0 15px currentColor" }} />

                  <div className="absolute -top-16 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    <div className="backdrop-blur-md bg-background/95 border border-white/30 rounded-lg px-3 py-2 shadow-xl">
                      <div className={`text-2xl ${tech.color}`} style={{ textShadow: "0 0 10px currentColor" }}>
                        {tech.icon}
                      </div>
                      <div className="text-xs font-bold text-foreground mt-1">
                        {tech.name}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {metrics.map((metric, i) => {
          const baseOffset = isClient ? (window.innerWidth < 640 ? 110 : window.innerWidth < 1024 ? 150 : 200) : 150
          const positions = [
            { x: -baseOffset, y: -baseOffset, z: 100 },
            { x: baseOffset, y: -baseOffset, z: 100 },
            { x: baseOffset, y: baseOffset, z: 100 },
            { x: -baseOffset, y: baseOffset, z: 100 },
          ]
          const pos = positions[i]

          return (
            <div
              key={`metric-${i}`}
              className="absolute top-1/2 left-1/2 group"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate(-50%, -50%) translate3d(${pos.x}px, ${pos.y}px, ${pos.z}px)`,
              }}
              onClick={() => setIsMinimized(!isMinimized)}
            >
              {!isMinimized ? (
                <div className="relative group/metric cursor-pointer">
                  <div className={`absolute -inset-4 w-24 h-24 rounded-full ${metric.color} opacity-10 blur-3xl animate-pulse`} style={{ animationDuration: `${3.5 + (i % 2) * 0.5}s` }} />
                  <div className={`absolute -inset-3 w-22 h-22 rounded-full ${metric.color} opacity-6 blur-3xl`} />

                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-full backdrop-blur-sm bg-background/40 border border-white/10 shadow-2xl flex flex-col items-center justify-center hover:scale-125 transition-all duration-500">
                    <div className={`text-lg sm:text-xl lg:text-2xl ${metric.color}`} style={{ textShadow: "0 0 12px currentColor" }}>
                      {metric.icon}
                    </div>
                    <div className="text-[8px] sm:text-[9px] lg:text-[10px] font-bold text-foreground/70 mt-0.5">
                      {metric.value}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative cursor-pointer">
                  <div className={`w-4 h-4 rounded-full ${metric.color} shadow-lg transition-all group-hover:scale-150`}
                       style={{ boxShadow: "0 0 20px currentColor" }} />

                  <div className="absolute -top-20 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    <div className="backdrop-blur-md bg-background/95 border border-white/30 rounded-lg px-3 py-2 shadow-xl">
                      <div className={`text-3xl ${metric.color}`} style={{ textShadow: "0 0 10px currentColor" }}>
                        {metric.icon}
                      </div>
                      <div className="text-base font-bold text-foreground mt-1">
                        {metric.value}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {[...Array(40)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 40
          const baseRadius = isClient ? (window.innerWidth < 640 ? 130 : window.innerWidth < 1024 ? 180 : 240) : 180
          const radius = baseRadius + (i % 4) * 20
          const x = isClient ? Math.cos(angle) * radius : 0
          const z = isClient ? Math.sin(angle) * radius : 0

          return (
            <div
              key={`particle-${i}`}
              className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-primary/60"
              style={{
                transformStyle: "preserve-3d",
                transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px)`,
                animation: `rotate-particle ${8 + (i % 4)}s linear infinite`,
                animationDelay: `${i * 0.08}s`,
                boxShadow: "0 0 8px currentColor",
              }}
            />
          )
        })}

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
