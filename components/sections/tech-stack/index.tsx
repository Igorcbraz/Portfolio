"use client"

import { useState, useEffect, useRef } from "react"
import { m, AnimatePresence } from "framer-motion"
import { sendGAEvent } from "@next/third-parties/google"
import { useLocale } from "@/contexts/LocaleContext"
import { useInView } from "@/hooks/use-animations"
import { SplitText } from "@/components/ui/split-text"
import { DecryptedText } from "@/components/ui/decrypted-text"
import { BlurText } from "@/components/ui/blur-text"

import { Category } from "./types"
import { categories, techByCategory } from "./constants"
import { FrontendShape } from "./frontend-shape"
import { BackendShape } from "./backend-shape"
import { MobileShape } from "./mobile-shape"
import { DatabaseShape } from "./database-shape"
import { DevOpsShape } from "./devops-shape"
import { ToolsShape } from "./tools-shape"

export function TechStack() {
  const { dictionary } = useLocale()
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true })

  const [selectedCategory, setSelectedCategory] = useState<Category>("Frontend")
  const containerRef = useRef<HTMLDivElement>(null)
  const innerContainerRef = useRef<HTMLDivElement>(null)
  const containerRectRef = useRef<DOMRect | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
      setIsTouchDevice(isTouch)
    }
  }, [])

  const handleMouseEnter = () => {
    if (!containerRef.current || isTouchDevice) return
    containerRectRef.current = containerRef.current.getBoundingClientRect()
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isTouchDevice) return
    const rect = containerRectRef.current || containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    const rx = -y * 10
    const ry = x * 10
    if (innerContainerRef.current) {
      innerContainerRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`
    }
  }

  const handleMouseLeave = () => {
    containerRectRef.current = null
    if (innerContainerRef.current) {
      innerContainerRef.current.style.transform = "rotateX(0deg) rotateY(0deg)"
    }
  }

  const renderShape = () => {
    const technologies = techByCategory[selectedCategory]
    switch (selectedCategory) {
      case "Frontend":
        return <FrontendShape technologies={technologies} isTouchDevice={isTouchDevice} />
      case "Backend":
        return <BackendShape technologies={technologies} isTouchDevice={isTouchDevice} />
      case "Mobile":
        return <MobileShape technologies={technologies} isTouchDevice={isTouchDevice} />
      case "Database":
        return <DatabaseShape technologies={technologies} isTouchDevice={isTouchDevice} />
      case "DevOps":
        return <DevOpsShape technologies={technologies} isTouchDevice={isTouchDevice} />
      case "Tools":
        return <ToolsShape technologies={technologies} isTouchDevice={isTouchDevice} />
    }
  }

  return (
    <>
      <style>{`
        @keyframes ts-scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .ts-scanline {
          position: absolute; left: 0; top: 0;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, oklch(0.62 0.22 41.1 / 0.14), transparent);
          animation: ts-scan 10s linear infinite;
          pointer-events: none; z-index: 1;
        }
      `}</style>

      <section ref={sectionRef} className="relative min-h-screen py-24 bg-background overflow-hidden">

        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 hero-grid-pattern opacity-60" />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 40%, var(--background) 100%)" }} />
          <m.div
            className="absolute top-[-5%] right-[5%] w-[500px] h-[500px] rounded-full bg-[oklch(0.62_0.22_41.1/0.08)] blur-[90px]"
            style={{ willChange: "transform, opacity" }}
            animate={{ y: [0, 30, 0], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <m.div
            className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-[oklch(0.55_0.18_260/0.05)] blur-[80px]"
            style={{ willChange: "transform, opacity" }}
            animate={{ y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          />
          <div className="ts-scanline" />
          <div className="absolute left-8 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent,oklch(0.62_0.22_41.1/0.15),transparent)]" />
          <div className="absolute right-8 top-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent,oklch(0.62_0.22_41.1/0.15),transparent)]" />
          <div className="absolute top-8 left-10 hidden lg:block">
            <span className="text-[9px] font-mono text-[oklch(0.62_0.22_41.1/0.25)] uppercase tracking-widest block mt-0.5">MODE: INTERACTIVE</span>
          </div>
          <div className="absolute bottom-8 right-10 hidden lg:block text-right">
            <span className="text-[9px] font-mono text-[oklch(0.62_0.22_41.1/0.3)] uppercase tracking-widest block">PORTFOLIO.SKILLS v2.0</span>
            <span className="text-[9px] font-mono text-[oklch(0.62_0.22_41.1/0.2)] uppercase tracking-widest block mt-0.5">2026</span>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <m.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-8 h-px bg-primary" />
              <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.25em] font-display">
                <DecryptedText
                  text={dictionary.techStack.sectionLabel}
                  speed={30}
                  delay={0}
                  className="text-primary"
                />
              </span>
              <div className="w-8 h-px bg-primary" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[0.95]">
              <SplitText
                text={dictionary.techStack.title}
                splitType="words"
                stepDelay={70}
                delay={0}
                threshold={0.1}
              />{" "}
              <m.span
                className="inline-block bg-[linear-gradient(90deg,oklch(0.62_0.22_41.1),oklch(0.82_0.20_75),oklch(0.62_0.22_41.1))] bg-size-[200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] animate-[shimmer_4s_linear_infinite]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
              >
                {dictionary.techStack.titleHighlight}
              </m.span>
            </h2>

            <m.p
              className="mt-5 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto font-sans leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <BlurText
                text={dictionary.techStack.subtitle}
                animateBy="words"
                direction="top"
                delay={0}
                stepDelay={28}
                className="text-muted-foreground"
                threshold={0.1}
              />
            </m.p>
          </m.div>

          <m.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="hidden sm:flex flex-wrap justify-center gap-0 border border-[oklch(0.62_0.22_41.1/0.2)]">
              {categories.map((category, idx) => {
                const IconComponent = category.icon
                const isSelected = selectedCategory === category.name
                return (
                  <m.button
                    key={category.name}
                    onClick={() => {
                      sendGAEvent("event", "tech_stack_category_click", { label: category.name })
                      setSelectedCategory(category.name)
                    }}
                    className={`relative flex items-center gap-2.5 px-6 py-4 font-semibold transition-all duration-200 focus:outline-none cursor-pointer cursor-target border-r border-[oklch(0.62_0.22_41.1/0.12)] last:border-r-0 ${isSelected
                      ? "bg-primary text-background"
                      : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-[oklch(0.62_0.22_41.1/0.06)]"
                      }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.9 + idx * 0.05, duration: 0.4 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className={`text-[9px] font-mono tracking-widest ${isSelected ? "text-background/60" : "text-[oklch(0.62_0.22_41.1/0.5)]"}`}>
                      {category.code}
                    </span>
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm font-display">{category.name}</span>
                  </m.button>
                )
              })}
            </div>

            <div className="sm:hidden overflow-x-auto scrollbar-hide">
              <div className="flex gap-0 border border-[oklch(0.62_0.22_41.1/0.2)] w-max mx-auto">
                {categories.map((category, idx) => {
                  const IconComponent = category.icon
                  const isSelected = selectedCategory === category.name
                  return (
                    <m.button
                      key={category.name}
                      onClick={() => {
                        sendGAEvent("event", "tech_stack_category_click", { label: category.name })
                        setSelectedCategory(category.name)
                      }}
                      className={`shrink-0 flex flex-col items-center gap-1 px-4 py-3 font-semibold transition-all duration-200 focus:outline-none cursor-pointer cursor-target border-r border-[oklch(0.62_0.22_41.1/0.1)] last:border-r-0 ${isSelected
                        ? "bg-primary text-background"
                        : "bg-transparent text-muted-foreground"
                        }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: 0.9 + idx * 0.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <IconComponent className="w-4 h-4" />
                      <span className="text-[9px] font-mono tracking-widest">{category.code}</span>
                    </m.button>
                  )
                })}
              </div>
            </div>
          </m.div>

          <AnimatePresence mode="wait">
            <m.div
              key={selectedCategory}
              ref={containerRef}
              onMouseEnter={handleMouseEnter}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative mx-auto flex items-center justify-center"
              style={{ minHeight: "480px", perspective: "1400px" }}
              initial={{ opacity: 0, scale: 0.88, rotateY: 50 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.88, rotateY: -50 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <m.div
                ref={innerContainerRef}
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.5s ease-out",
                }}
              >
                {renderShape()}
              </m.div>
            </m.div>
          </AnimatePresence>

          <m.div
            className="mt-20 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <div className="flex-1 h-px bg-[linear-gradient(to_right,oklch(0.62_0.22_41.1/0.3),transparent)]" />
            <div className="flex-1 h-px bg-[linear-gradient(to_left,oklch(0.62_0.22_41.1/0.3),transparent)]" />
          </m.div>
        </div>
      </section>
    </>
  )
}
