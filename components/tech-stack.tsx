"use client"

import { useState, useEffect, useRef, ComponentType } from "react"
import { Database, Cloud, Layout, Server, Terminal, Code, Smartphone } from "lucide-react"
import {
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiVuedotjs,
  SiNodedotjs,
  SiExpress,
  SiPostgresql,
  SiMongodb,
  SiMysql,
  SiDocker,
  SiAmazon,
  SiGithubactions,
  SiGit,
  SiLinux,
  SiJavascript,
  SiJest,
  SiCapacitor,
  SiApachecordova,
  SiGoogleplay,
  SiJira,
  SiConfluence,
  SiQuasar,
  SiEslint
} from "react-icons/si"

type Category = "Frontend" | "Backend" | "Mobile" | "Database" | "DevOps" | "Tools"
interface Technology {
  name: string
  icon: any
  color: string
}

const techByCategory: Record<Category, Technology[]> = {
  Frontend: [
    { name: "React", icon: SiReact, color: "#61DAFB" },
    { name: "Vue.js", icon: SiVuedotjs, color: "#4FC08D" },
    { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
    { name: "Quasar", icon: SiQuasar, color: "#1976D2" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  ],
  Backend: [
    { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
    { name: "Express", icon: SiExpress, color: "#000000" },
    { name: "Jest", icon: SiJest, color: "#C21325" },
    { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
    { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
  ],
  Mobile: [
    { name: "React Native", icon: SiReact, color: "#61DAFB" },
    { name: "Capacitor", icon: SiCapacitor, color: "#119EFF" },
    { name: "Cordova", icon: SiApachecordova, color: "#E8E8E8" },
    { name: "PlayStore", icon: SiGoogleplay, color: "#c71c56" },
    { name: "Quasar", icon: SiQuasar, color: "#1976D2" },
  ],
  Database: [
    { name: "PostgreSQL", icon: SiPostgresql, color: "#4169E1" },
    { name: "MySQL", icon: SiMysql, color: "#4479A1" },
    { name: "MongoDB", icon: SiMongodb, color: "#47A248" },
  ],
  DevOps: [
    { name: "Docker", icon: SiDocker, color: "#2496ED" },
    { name: "AWS", icon: SiAmazon, color: "#FF9900" },
    { name: "Git", icon: SiGit, color: "#F05032" },
    { name: "GitHub Actions", icon: SiGithubactions, color: "#2088FF" },
  ],
  Tools: [
    { name: "Jira", icon: SiJira, color: "#0052CC" },
    { name: "Confluence", icon: SiConfluence, color: "#172B4D" },
    { name: "Linux", icon: SiLinux, color: "#FCC624" },
    { name: "ESLint", icon: SiEslint, color: "#4B32C3" }
  ],
}

type CategoryInfo = { name: Category; icon: ComponentType<any>; color: string; bgColor: string }

const categories: CategoryInfo[] = [
  { name: "Frontend", icon: Layout, color: "text-blue-500", bgColor: "bg-blue-500" },
  { name: "Backend", icon: Server, color: "text-green-500", bgColor: "bg-green-500" },
  { name: "Mobile", icon: Smartphone, color: "text-cyan-500", bgColor: "bg-cyan-500" },
  { name: "Database", icon: Database, color: "text-purple-500", bgColor: "bg-purple-500" },
  { name: "DevOps", icon: Cloud, color: "text-orange-500", bgColor: "bg-orange-500" },
  { name: "Tools", icon: Terminal, color: "text-yellow-500", bgColor: "bg-yellow-500" },
]

export function TechStack() {

  const [selectedCategory, setSelectedCategory] = useState<Category>("Frontend")
  const [hoveredTech, setHoveredTech] = useState<string | null>(null)
  const [rotation, setRotation] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0)
      setIsTouchDevice(isTouch)
      if (isTouch) {
        setSelectedCategory("Mobile")
      }
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setRotation({ x: -y * 20, y: x * 20 })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
  }

  const render3DShape = () => {
    const technologies = techByCategory[selectedCategory]
    switch (selectedCategory) {
      case "Frontend":
        return (
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>
            <div
              className="relative w-[320px] sm:w-[560px] h-[230px] sm:h-[390px] rounded-2xl overflow-hidden"
              style={{ transform: "translateZ(20px)" }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-cyan-500/5 to-transparent backdrop-blur-xl border-2 border-blue-400/30 rounded-2xl">
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `linear-gradient(rgba(96, 165, 250, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 165, 250, 0.3) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}></div>
                <div className="hidden sm:block absolute top-4 left-4 w-20 h-20 bg-linear-to-br from-blue-400/20 to-cyan-400/20 backdrop-blur-sm border border-blue-300/40 rounded-lg animate-pulse"
                  style={{ transform: "translateZ(40px)" }}>
                  <div className="absolute inset-2 border-2 border-blue-400/30 rounded"></div>
                </div>
                <div className="hidden sm:flex absolute top-8 right-8 gap-1" style={{ transform: "translateZ(35px)" }}>
                  {['#60A5FA', '#34D399', '#F472B6', '#FBBF24'].map((color, i) => (
                    <div key={i} className="w-8 h-8 rounded border border-white/30 backdrop-blur-sm animate-pulse"
                      style={{ backgroundColor: `${color}40`, animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>
                <div className="hidden sm:block absolute bottom-8 left-8 font-mono text-blue-300/40 text-2xl" style={{ transform: "translateZ(30px)" }}>
                  {'</>'}
                </div>
                <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-8">
                  <div className="grid grid-cols-3 grid-rows-2 gap-2 sm:gap-4 w-full">
                    {technologies.map((tech, index) => {
                      const Icon = tech.icon
                      const isHovered = hoveredTech === tech.name
                      return (
                        <div
                          key={index}
                          onMouseEnter={() => !isTouchDevice && setHoveredTech(tech.name)}
                          onMouseLeave={() => !isTouchDevice && setHoveredTech(null)}
                          onClick={() => isTouchDevice && setHoveredTech(hoveredTech === tech.name ? null : tech.name)}
                          className={`relative flex flex-col items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 rounded-xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
                            isHovered
                              ? "border-blue-400/60 bg-blue-500/20 scale-110 shadow-lg shadow-blue-500/30"
                              : "border-blue-400/20 bg-blue-500/5 hover:border-blue-400/40"
                          }`}
                          style={{ transform: isHovered ? "translateZ(50px)" : "translateZ(20px)" }}
                        >
                          <Icon className="w-5 h-5 sm:w-8 sm:h-8" style={{ color: isHovered ? '#60A5FA' : tech.color }} />
                          <span className="text-[8px] sm:text-[10px] font-medium text-blue-100/80 text-center">{tech.name}</span>
                          {isHovered && (
                            <div className="absolute inset-0 bg-blue-400/10 rounded-xl blur-sm -z-10 animate-pulse"></div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="absolute inset-x-0 h-0.5 bg-linear-to-r from-transparent via-blue-400/50 to-transparent animate-pulse"></div>
              </div>
              <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-2xl -z-10"></div>
            </div>
            <div
              className="hidden sm:block absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-12 bg-linear-to-b from-blue-500/20 to-transparent backdrop-blur-sm border border-blue-400/30 rounded-b-2xl"
              style={{ transform: "translateY(20px) translateZ(-10px)" }}
            >
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-blue-400/50"></div>
            </div>
          </div>
        )

      case "Mobile":
        return (
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>
            <div
              className="relative w-[300px] h-[550px] rounded-[40px] overflow-hidden"
              style={{ transform: "translateZ(20px)" }}
            >
              <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-blue-500/5 to-transparent backdrop-blur-xl border-4 border-cyan-400/30 rounded-[40px]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-background/80 rounded-b-2xl border-x-2 border-b-2 border-cyan-400/20"></div>

                <div className="absolute inset-4 top-8 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 opacity-15" style={{
                    backgroundImage: `linear-gradient(rgba(6, 182, 212, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.3) 1px, transparent 1px)`,
                    backgroundSize: '25px 25px'
                  }}></div>

                  <div className="absolute inset-4 grid grid-cols-2 grid-rows-3 gap-4">
                    {technologies.map((tech, index) => {
                      const Icon = tech.icon
                      const isHovered = hoveredTech === tech.name
                      return (
                        <div
                          key={index}
                          onMouseEnter={() => setHoveredTech(tech.name)}
                          onMouseLeave={() => setHoveredTech(null)}
                          className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl backdrop-blur-md border transition-all duration-300 cursor-pointer ${
                            isHovered
                              ? "border-cyan-400/60 bg-cyan-500/20 scale-110 shadow-lg shadow-cyan-500/30"
                              : "border-cyan-400/20 bg-cyan-500/5 hover:border-cyan-400/40"
                          }`}
                          style={{
                            transform: isHovered ? "translateZ(40px)" : "translateZ(10px)",
                          }}
                        >
                          <Icon className="w-10 h-10" style={{ color: isHovered ? '#06B6D4' : tech.color }} />
                          <span className="text-[9px] font-medium text-cyan-100/80 text-center leading-tight">{tech.name}</span>
                          {isHovered && (
                            <>
                              <div className="absolute inset-0 bg-cyan-400/10 rounded-2xl blur-sm -z-10 animate-pulse"></div>
                              <div className="absolute -inset-1 border-2 border-cyan-400/40 rounded-2xl animate-pulse"></div>
                            </>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-cyan-400/30 rounded-full"></div>
                </div>

                <div className="absolute inset-4 top-8 bg-cyan-500/5 rounded-3xl animate-pulse"></div>
              </div>

              <div className="absolute inset-0 bg-cyan-500/10 rounded-[40px] blur-2xl -z-10"></div>
            </div>

            <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-500/30 border-2 border-cyan-400/50 rounded-full flex items-center justify-center animate-pulse"
              style={{ transform: "translateZ(50px)" }}>
              <span className="text-xs text-cyan-100 font-bold">{technologies.length}</span>
            </div>
          </div>
        )

      case "Backend":
        return (
          <div className="relative flex flex-col gap-3" style={{ transformStyle: "preserve-3d" }}>
            {technologies.map((tech, index) => {
              const Icon = tech.icon
              const isHovered = hoveredTech === tech.name
              return (
                <div key={index} className="relative">
                  <div
                    onMouseEnter={() => !isTouchDevice && setHoveredTech(tech.name)}
                    onMouseLeave={() => !isTouchDevice && setHoveredTech(null)}
                    onClick={() => isTouchDevice && setHoveredTech(hoveredTech === tech.name ? null : tech.name)}
                    className={`relative w-[280px] sm:w-[500px] h-16 sm:h-20 backdrop-blur-xl border-2 rounded-xl flex items-center gap-3 sm:gap-6 px-3 sm:px-6 transition-all duration-300 cursor-pointer ${
                      isHovered
                        ? "border-green-400/60 bg-green-500/20 scale-105 shadow-2xl shadow-green-500/30"
                        : "border-green-400/20 bg-green-500/5"
                    }`}
                    style={{
                      transform: `translateZ(${index * 25}px) ${isHovered ? "translateX(-30px)" : ""}`,
                    }}
                  >
                    <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center ${
                      isHovered ? "border-green-400" : "border-green-400/30"
                    }`}>
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: isHovered ? '#4ADE80' : tech.color }} />
                    </div>

                    <div className="flex-1">
                      <p className="text-sm sm:text-base font-bold text-green-100">{tech.name}</p>
                      <div className="flex gap-1.5 mt-1.5">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full transition-all ${
                              isHovered ? "bg-green-400 animate-pulse" : "bg-green-500/30"
                            }`}
                            style={{ animationDelay: `${i * 0.1}s` }}
                          ></div>
                        ))}
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-end gap-1">
                      <div className={`text-[10px] font-mono px-2 py-1 rounded border ${
                        isHovered
                          ? "border-green-400/60 bg-green-400/20 text-green-200"
                          : "border-green-400/30 bg-green-500/10 text-green-300/60"
                      }`}>
                        {isHovered ? "ACTIVE" : "READY"}
                      </div>
                      {isHovered && (
                        <div className="flex gap-1 animate-pulse">
                          <span className="text-green-400 text-xs">→</span>
                          <span className="text-green-400 text-xs">→</span>
                        </div>
                      )}
                    </div>

                    {isHovered && (
                      <div className="absolute inset-0 bg-green-400/10 rounded-xl blur-xl -z-10 animate-pulse"></div>
                    )}
                  </div>

                  {index < technologies.length - 1 && (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-0.5 h-3 bg-linear-to-b from-green-400/50 to-transparent"
                      style={{ transform: `translateZ(${index * 25 + 10}px)` }}></div>
                  )}
                </div>
              )
            })}
          </div>
        )

      case "Database":
        return (
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative w-80 h-[450px]" style={{ transform: "translateZ(0px)" }}>
              <div className="absolute top-0 left-0 w-80 h-16 rounded-[50%] backdrop-blur-xl bg-purple-500/15 border-2 border-purple-400/40"
                style={{ transform: "translateZ(20px)" }}>
                <div className="absolute inset-2 rounded-[50%] border border-purple-400/20"></div>
              </div>

              <div className="absolute top-8 left-0 w-80 h-[426px] backdrop-blur-md bg-linear-to-b from-purple-500/15 via-purple-500/10 to-purple-500/15 border-x-2 border-purple-400/40">
                {technologies.map((tech, index) => {
                  const Icon = tech.icon
                  const isHovered = hoveredTech === tech.name
                  const sectionHeight = 426 / technologies.length

                  return (
                    <div key={index}>
                      <div
                        onMouseEnter={() => setHoveredTech(tech.name)}
                        onMouseLeave={() => setHoveredTech(null)}
                        className={`relative h-[${sectionHeight}px] flex items-center justify-center gap-4 cursor-pointer transition-all duration-300 ${
                          isHovered ? "bg-purple-500/25" : "bg-transparent hover:bg-purple-500/10"
                        }`}
                        style={{ height: `${sectionHeight}px` }}
                      >
                        <Icon className="w-8 h-8 z-10" style={{ color: isHovered ? '#A78BFA' : tech.color }} />
                        <span className="text-base font-bold text-purple-100 z-10">{tech.name}</span>

                        {isHovered && (
                          <>
                            <div className="absolute right-12 w-2 h-2 rounded-full bg-purple-400 animate-ping"></div>
                            <div className="absolute left-12 w-2 h-2 rounded-full bg-purple-400 animate-ping" style={{ animationDelay: '0.3s' }}></div>
                          </>
                        )}

                        {isHovered && (
                          <div className="absolute inset-0 bg-purple-400/10 blur-xl animate-pulse"></div>
                        )}
                      </div>

                      {index < technologies.length - 1 && (
                        <div className="absolute left-0 right-0 h-px bg-purple-400/30" style={{ top: `${(index + 1) * sectionHeight}px` }}>
                          <div className="absolute inset-0 bg-linear-to-r from-transparent via-purple-400/60 to-transparent"></div>
                        </div>
                      )}
                    </div>
                  )
                })}

                <div className="absolute inset-0 flex items-center justify-around opacity-30 pointer-events-none">
                  <div className="w-px h-full bg-linear-to-b from-transparent via-purple-400 to-transparent"></div>
                  <div className="w-px h-full bg-linear-to-b from-transparent via-purple-400 to-transparent"></div>
                  <div className="w-px h-full bg-linear-to-b from-transparent via-purple-400 to-transparent"></div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 w-80 h-16 rounded-[50%] backdrop-blur-xl bg-purple-500/15 border-2 border-purple-400/40"
                style={{ transform: "translateZ(20px)" }}>
                <div className="absolute inset-2 rounded-[50%] border border-purple-400/20"></div>
              </div>

              <div className="absolute inset-0 bg-purple-500/10 rounded-[50%] blur-3xl -z-10"></div>
            </div>
          </div>
        )

      case "DevOps":
        return (
          <div className="relative w-[500px] h-[400px] flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative" style={{ transform: "translateZ(30px)" }}>
              <div className="relative w-[450px] h-[400px]">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 backdrop-blur-xl bg-orange-500/10 border-2 border-orange-400/40 rounded-3xl"
                  style={{ transform: "rotateZ(45deg) translateZ(20px)" }}>
                  <div className="absolute inset-4 border border-orange-400/30 rounded-2xl"></div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
                </div>

                <div className="absolute inset-0">
                  {[...Array(5)].map((_, i) => (
                    <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-orange-400/40 to-transparent"
                      style={{ top: `${20 + i * 20}%`, animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                  {[...Array(5)].map((_, i) => (
                    <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-linear-to-b from-transparent via-orange-400/40 to-transparent"
                      style={{ left: `${20 + i * 20}%`, animationDelay: `${i * 0.2}s` }}></div>
                  ))}
                </div>

                <div className="absolute inset-0">
                  {technologies.map((tech, index) => {
                    const Icon = tech.icon
                    const isHovered = hoveredTech === tech.name
                    const positions = [
                      { top: '15%', left: '15%' },
                      { top: '15%', right: '15%' },
                      { bottom: '15%', right: '15%' },
                      { bottom: '15%', left: '15%' },
                    ]

                    return (
                      <div key={index}>
                        <div
                          onMouseEnter={() => setHoveredTech(tech.name)}
                          onMouseLeave={() => setHoveredTech(null)}
                          className={`absolute flex flex-col items-center justify-center gap-2 p-4 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 cursor-pointer ${
                            isHovered
                              ? "border-orange-400/70 bg-orange-500/30 scale-125 shadow-2xl shadow-orange-500/40"
                              : "border-orange-400/30 bg-orange-500/10"
                          }`}
                          style={{
                            ...positions[index],
                            transform: isHovered ? "translateZ(50px)" : "translateZ(20px)",
                          }}
                        >
                          <Icon className="w-10 h-10" style={{ color: isHovered ? '#FB923C' : tech.color }} />
                          <span className="text-xs font-bold text-orange-100 text-center whitespace-nowrap">{tech.name}</span>

                          {isHovered && (
                            <>
                              <div className="absolute inset-0 bg-orange-400/20 rounded-xl blur-xl -z-10 animate-pulse"></div>
                              <div className="absolute -inset-2 border-2 border-orange-400/40 rounded-xl animate-ping"></div>
                            </>
                          )}
                        </div>

                        {isHovered && (
                          <>
                            <div className="absolute top-1/2 left-1/2 w-0.5 h-24 bg-linear-to-b from-orange-400/60 to-transparent origin-bottom"
                              style={{
                                ...positions[index],
                                transform: index < 2 ? 'translateY(40px)' : 'translateY(-64px) rotateZ(180deg)',
                              }}></div>
                            <div className="absolute top-1/2 left-1/2 w-24 h-0.5 bg-linear-to-r from-orange-400/60 to-transparent origin-left"
                              style={{
                                ...positions[index],
                                transform: index % 2 === 0 ? 'translateX(40px)' : 'translateX(-64px) rotateZ(180deg)',
                              }}></div>
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>

                {[...Array(4)].map((_, i) => (
                  <div key={i} className="absolute w-3 h-3 rounded-full bg-orange-400/60 animate-pulse"
                    style={{
                      [i < 2 ? 'top' : 'bottom']: '8%',
                      [i % 2 === 0 ? 'left' : 'right']: '8%',
                      animationDelay: `${i * 0.3}s`
                    }}>
                    <div className="absolute inset-0 bg-orange-400/40 rounded-full animate-ping"></div>
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 bg-orange-500/10 blur-3xl -z-10"></div>
            </div>
          </div>
        )

      case "Tools":
        return (
          <div className="relative w-[320px] sm:w-[560px] h-[230px] sm:h-[390px]" style={{ transformStyle: "preserve-3d" }}>
            <div className="relative w-full h-full">
              <div
                className="absolute inset-0 backdrop-blur-2xl bg-linear-to-br from-yellow-500/8 via-amber-500/5 to-yellow-500/3 border-2 border-yellow-400/25 rounded-3xl"
                style={{ transform: "translateZ(40px)" }}
              >
                <div className="absolute inset-0 opacity-8 rounded-3xl" style={{
                  backgroundImage: `linear-gradient(rgba(251, 191, 36, 0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(251, 191, 36, 0.25) 1px, transparent 1px)`,
                  backgroundSize: '25px 25px'
                }}></div>

                <div
                  className="hidden sm:block absolute -top-16 inset-x-4 h-20 backdrop-blur-xl bg-linear-to-b from-yellow-500/12 to-yellow-500/6 border-2 border-yellow-400/25 rounded-t-3xl"
                  style={{
                    transform: "rotateX(-50deg)",
                    transformOrigin: "bottom",
                    boxShadow: "0 -10px 30px rgba(251, 191, 36, 0.2)"
                  }}
                >
                  <div className="absolute inset-2 border border-yellow-400/15 rounded-t-2xl"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-4 backdrop-blur-sm bg-yellow-500/12 border border-yellow-400/30 rounded-full"></div>
                </div>

                <div className="absolute inset-4 sm:inset-8 grid grid-cols-2 grid-rows-2 gap-2 sm:gap-4">
                  {technologies.map((tech, index) => {
                    const Icon = tech.icon
                    const isHovered = hoveredTech === tech.name
                    return (
                      <div
                        key={index}
                        onMouseEnter={() => !isTouchDevice && setHoveredTech(tech.name)}
                        onMouseLeave={() => !isTouchDevice && setHoveredTech(null)}
                        onClick={() => isTouchDevice && setHoveredTech(hoveredTech === tech.name ? null : tech.name)}
                        className={`relative flex flex-col items-center justify-center gap-2 sm:gap-3 p-3 sm:p-5 rounded-2xl backdrop-blur-xl border-2 transition-all duration-300 cursor-pointer ${
                          isHovered
                            ? "border-yellow-400/50 bg-yellow-500/20 scale-110 shadow-2xl shadow-yellow-500/25"
                            : "border-yellow-400/20 bg-yellow-500/5 hover:border-yellow-400/35"
                        }`}
                        style={{
                          transform: isHovered ? "translateZ(60px) rotateY(8deg)" : "translateZ(20px)",
                        }}
                      >
                        <div className={`relative ${isHovered && !isTouchDevice ? "animate-bounce" : ""}`} style={{ animationDuration: '2s' }}>
                          <Icon className="w-8 h-8 sm:w-12 sm:h-12" style={{ color: isHovered ? '#FBBF24' : tech.color }} />

                          {isHovered && (
                            <>
                              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                              <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-300 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                            </>
                          )}
                        </div>

                        <span className="text-xs sm:text-sm font-bold text-yellow-100 text-center">{tech.name}</span>

                        {isHovered && (
                          <div className="absolute inset-0 bg-yellow-400/12 rounded-2xl blur-xl -z-10 animate-pulse"></div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 border-2 border-yellow-400/30 rounded-full"
                    style={{
                      [i < 2 ? 'top' : 'bottom']: '10px',
                      [i % 2 === 0 ? 'left' : 'right']: '10px',
                    }}
                  >
                    <div className="absolute inset-1 bg-yellow-400/20 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
                  </div>
                ))}
              </div>

              <div
                className="absolute inset-0 backdrop-blur-xl bg-yellow-500/3 border-2 border-yellow-400/15 rounded-3xl"
                style={{ transform: "translateZ(0px)" }}
              ></div>

              <div className="absolute inset-0 bg-yellow-500/6 rounded-3xl blur-3xl -z-10"></div>
            </div>
          </div>
        )
    }
  }

  return (
    <section className="relative min-h-screen py-20 bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Tech <span className="text-primary">Stack</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Selecione uma categoria e explore as tecnologias
          </p>
        </div>
        <div className="mb-16">
          <div className="hidden sm:flex flex-wrap justify-center gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon
            const isSelected = selectedCategory === category.name
            return (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl border-2 font-semibold transition-all duration-300 focus:outline-none ${
                  isSelected
                    ? `border-primary ${category.bgColor} text-white shadow-lg shadow-primary/30 scale-105`
                    : "border-border/30 bg-card text-foreground hover:border-primary/50 hover:scale-105"
                }`}
              >
                <IconComponent className={`w-6 h-6 ${isSelected ? "text-white" : category.color}`} />
                <span>{category.name}</span>
              </button>
            )
          })}
          </div>
          <div className="sm:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 px-4 pb-2">
              {categories.map((category) => {
                const IconComponent = category.icon
                const isSelected = selectedCategory === category.name
                return (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl border-2 font-semibold transition-all duration-300 focus:outline-none whitespace-nowrap ${
                      isSelected
                        ? `border-primary ${category.bgColor} text-white shadow-lg shadow-primary/30 scale-105`
                        : "border-border/30 bg-card text-foreground"
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 ${isSelected ? "text-white" : category.color}`} />
                    <span className="text-sm">{category.name}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative mx-auto mb-8 sm:mb-8 flex items-center justify-center"
          style={{
            minHeight: "350px",
            perspective: "1200px",
          }}
        >
          <div
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
              transition: "transform 0.5s ease-out",
            }}
          >
            {render3DShape()}
          </div>
        </div>
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Sempre aprendendo e explorando novas tecnologias 🚀
          </p>
        </div>
      </div>
    </section>
  )
}
