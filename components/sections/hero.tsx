"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { sendGAEvent } from '@next/third-parties/google'
import { useUser } from "@/contexts/UserContext"
import { useLocale } from "@/contexts/LocaleContext"
import { useCountUp, useInView, useMagneticEffect } from "@/hooks/use-animations"

const Shape3d = dynamic(() => import("@/components/features/3d-shape").then(m => m.Shape3d), {
  ssr: false,
  loading: () => null,
})

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { userData } = useUser()
  const { dictionary } = useLocale()
  const { ref: heroRef, isInView } = useInView()
  const { ref: btnRef1, position: btnPos1 } = useMagneticEffect<HTMLButtonElement>(0.2)
  const { ref: btnRef2, position: btnPos2 } = useMagneticEffect<HTMLButtonElement>(0.2)

  const reposCount = useCountUp(userData?.github.totalRepos || 0, 2000, isInView)
  const starsCount = useCountUp(userData?.github.totalStars || 0, 2000, isInView)
  const yearsCount = useCountUp(userData?.github.yearsExperience || 4, 1500, isInView)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const scrollToNextSection = () => {
    sendGAEvent('event', 'hero_me_conheca_click', { label: dictionary.hero.knowMeBetter })
    window.scrollTo({
      top: window.innerHeight,
      behavior: 'smooth'
    })
  }

  const scrollToContact = () => {
    sendGAEvent('event', 'hero_contato_click', { label: dictionary.hero.contactMe })
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        ></div>
        <div
          className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] animate-pulse"
          style={{
            animationDelay: "1s",
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        ></div>
      </div>

      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 30 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="space-y-8">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5, ease: "backOut" }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.span
                  className="w-2 h-2 bg-primary rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-sm text-primary font-medium">{dictionary.hero.role}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight overflow-hidden">
                  <motion.span
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                  >
                    {dictionary.hero.greeting.split("Igor Braz").shift()}{" "}
                  </motion.span>
                  <motion.span
                    className="text-primary inline-block"
                    initial={{ opacity: 0, x: -20, filter: "blur(10px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  >
                    Igor Braz
                  </motion.span>
                </h1>
                <motion.p
                  className="text-lg sm:text-xl text-muted-foreground font-light max-w-2xl leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.7 }}
                >
                  {dictionary.hero.description}
                </motion.p>
              </motion.div>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <motion.button
                  ref={btnRef1}
                  onClick={scrollToNextSection}
                  className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold overflow-hidden cursor-pointer"
                  style={{
                    transform: `translate(${btnPos1.x}px, ${btnPos1.y}px)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(var(--primary-rgb), 0.3)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative flex items-center gap-2">
                    {dictionary.hero.knowMeBetter}
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      →
                    </motion.span>
                  </span>
                </motion.button>
                <motion.button
                  ref={btnRef2}
                  onClick={scrollToContact}
                  className="px-8 py-4 text-foreground rounded-lg font-semibold border border-border/50 hover:border-primary/50 backdrop-blur-sm cursor-pointer"
                  style={{
                    transform: `translate(${btnPos2.x}px, ${btnPos2.y}px)`,
                    transition: 'transform 0.2s ease-out'
                  }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.05)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  {dictionary.hero.contactMe}
                </motion.button>
              </motion.div>

              <motion.div
                className="flex gap-8 pt-8 border-t border-border/30"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.7 }}
              >
                {[
                  { number: reposCount, label: dictionary.hero.repositories },
                  { number: starsCount, label: dictionary.hero.githubStars },
                  { number: yearsCount, label: dictionary.hero.yearsOfExperience },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6 + index * 0.1, duration: 0.5, ease: "backOut" }}
                    whileHover={{ scale: 1.1, y: -5 }}
                    className="group cursor-default"
                  >
                    <motion.p
                      className="text-2xl font-bold text-primary"
                      key={stat.number}
                    >
                      {stat.number}+
                    </motion.p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest group-hover:text-foreground transition-colors">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.5, rotateY: 180 }}
            animate={{
              opacity: isLoaded ? 1 : 0,
              scale: isLoaded ? 1 : 0.5,
              rotateY: isLoaded ? 0 : 180
            }}
            transition={{
              duration: 1.2,
              ease: [0.22, 1, 0.36, 1],
              delay: 0.8
            }}
            whileHover={{ scale: 1.05 }}
          >
            {isInView ? <Shape3d /> : null}
          </motion.div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
