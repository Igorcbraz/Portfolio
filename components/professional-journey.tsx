"use client"

import { useEffect, useRef, useState } from "react"
import journeyData from "@/data/journey.json"

interface JourneyStep {
  startDate: string
  endDate: string | null
  title: string
  company: string
  description: string
  icon: string
  highlights: string[]
}

export function ProfessionalJourney() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([])

  const formatDatePeriod = (startDate: string, endDate: string | null): string => {
    const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']

    if (!startDate) return ''

    const [startYear, startMonth] = startDate.split('-')
    const startFormatted = `${months[parseInt(startMonth) - 1]} de ${startYear}`

    if (!endDate) {
      return `${startFormatted} - o momento`
    }

    const [endYear, endMonth] = endDate.split('-')
    const endFormatted = `${months[parseInt(endMonth) - 1]} de ${endYear}`

    return `${startFormatted} - ${endFormatted}`
  }

  useEffect(() => {
    // Load journey data
    setJourneySteps(journeyData.experience)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const cards = containerRef.current.querySelectorAll('[data-journey-card]')
      let newIndex = 0

      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect()
        const cardMiddle = rect.top + rect.height / 2
        const windowMiddle = window.innerHeight / 2

        if (cardMiddle < windowMiddle) {
          newIndex = index
        }
      })

      setActiveIndex(newIndex)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={containerRef} className="relative min-h-screen py-20 bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-0 top-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Jornada <span className="text-primary">Profissional</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uma jornada de aprendizado contínuo e evolução como desenvolvedor
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-accent to-primary/20"></div>

          <div className="space-y-12">
            {journeySteps.map((step, index) => (
              <div
                key={index}
                data-journey-card
                className={`relative transition-all duration-700 ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div
                  className={`absolute left-8 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${
                    index <= activeIndex
                      ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                      : "bg-border scale-100"
                  }`}
                >
                  <span className={`text-sm transition-opacity ${index <= activeIndex ? "opacity-100" : "opacity-0"}`}>
                    {step.icon}
                  </span>
                </div>

                <div className="ml-20">
                  <div
                    className={`bg-card border rounded-xl p-6 transition-all duration-500 ${
                      index <= activeIndex
                        ? "border-primary/50 shadow-lg shadow-primary/10"
                        : "border-border/30"
                    }`}
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-sm text-primary font-semibold uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">{formatDatePeriod(step.startDate, step.endDate)}</p>
                          <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-2 wrap-break-word">{step.title}</h3>
                          <p className="text-base text-muted-foreground mt-1">{step.company}</p>
                        </div>
                        <span className="text-3xl sm:text-4xl shrink-0">{step.icon}</span>
                      </div>
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed mb-4 text-justify line-clamp-3 lg:line-clamp-none">{step.description}</p>

                    <div className="hidden lg:flex flex-wrap gap-2">
                      {step.highlights.map((tech, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 text-sm rounded-full transition-all duration-500 ${
                            index <= activeIndex
                              ? "bg-primary/10 border border-primary/30 text-primary"
                              : "bg-border/50 border border-border/30 text-muted-foreground"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="lg:hidden relative">
                      <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 pb-2">
                          {step.highlights.map((tech, i) => (
                            <span
                              key={i}
                              className={`shrink-0 px-3 py-1 text-sm rounded-full transition-all duration-500 ${
                                index <= activeIndex
                                  ? "bg-primary/10 border border-primary/30 text-primary"
                                  : "bg-border/50 border border-border/30 text-muted-foreground"
                              }`}
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-card to-transparent pointer-events-none"></div>
                    </div>

                    <style jsx>{`
                      .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                      .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                      }
                    `}</style>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
