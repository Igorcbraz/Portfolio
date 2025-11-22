"use client"

import { useState, useEffect } from "react"
import { sendGAEvent } from '@next/third-parties/google'
import { Shape3d } from "./3d-shape"
import { useUser } from "@/contexts/UserContext"
import { useLocale } from "@/contexts/LocaleContext"

export function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { userData } = useUser()
  const { dictionary } = useLocale()

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                <span className="text-sm text-primary font-medium">{dictionary.hero.role}</span>
              </div>

              <div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-tight">
                  {dictionary.hero.greeting.split("Igor Braz").shift()}{" "}<span className="text-primary">Igor Braz</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground font-light max-w-2xl leading-relaxed">
                  {dictionary.hero.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={scrollToNextSection}
                  className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold overflow-hidden hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <span className="relative">{dictionary.hero.knowMeBetter}</span>
                </button>
                <button
                  onClick={scrollToContact}
                  className="px-8 py-4 text-foreground rounded-lg font-semibold hover:bg-muted/50 transition-all duration-300"
                >
                  {dictionary.hero.contactMe}
                </button>
              </div>

              <div className="flex gap-8 pt-8 border-t border-border/30">
                  {[
                  { number: `${userData?.github.totalRepos || 0}+`, label: dictionary.hero.repositories },
                  { number: `${userData?.github.totalStars || 0}+`, label: dictionary.hero.githubStars },
                  { number: `${userData?.github.yearsExperience || 4}+`, label: dictionary.hero.yearsOfExperience },
                ].map((stat, index) => (
                  <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                    <p className="text-2xl font-bold text-primary">{stat.number}</p>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`flex justify-center items-center transition-all duration-1000 ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <Shape3d />
          </div>
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
