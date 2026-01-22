"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { getExperience } from '@/lib/data'
import { useLocale } from "@/contexts/LocaleContext"
import { useInView } from "@/hooks/use-animations"

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
  const { dictionary, locale } = useLocale()
  const containerRef = useRef<HTMLDivElement>(null)
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true })
  const [activeIndex, setActiveIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [journeySteps, setJourneySteps] = useState<JourneyStep[]>([])

  const formatDatePeriod = (startDate: string, endDate: string | null): string => {
    const monthsPt = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const months = locale === 'en' ? monthsEn : monthsPt

    if (!startDate) return ''

    const [startYear, startMonth] = startDate.split('-')
    const startFormatted = locale === 'en' ? `${months[parseInt(startMonth) - 1]} ${startYear}` : `${months[parseInt(startMonth) - 1]} de ${startYear}`

    if (!endDate) {
      return locale === 'en' ? `${startFormatted} - Present` : `${startFormatted} - o momento`
    }

    const [endYear, endMonth] = endDate.split('-')
    const endFormatted = locale === 'en' ? `${months[parseInt(endMonth) - 1]} ${endYear}` : `${months[parseInt(endMonth) - 1]} de ${endYear}`

    return `${startFormatted} - ${endFormatted}`
  }

  useEffect(() => {
    setJourneySteps(getExperience(locale) as JourneyStep[])
  }, [locale])

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
    <section ref={sectionRef} className="relative min-h-screen py-20 bg-background overflow-hidden">
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute left-0 top-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block"
            >
              {dictionary.journey.title}
            </motion.span>{" "}
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
            >
              Profissional
            </motion.span>
          </h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {dictionary.journey.subtitle}
          </motion.p>
        </motion.div>

        <div className="relative" ref={containerRef}>
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-primary via-accent to-primary/20"
            initial={{ scaleY: 0, originY: 0 }}
            animate={isInView ? { scaleY: 1 } : {}}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />

          <div className="space-y-12">
            {journeySteps.map((step: any, index: number) => (
              <motion.div
                key={index}
                data-journey-card
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{
                  duration: 0.7,
                  delay: index * 0.15,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="relative"
              >
                <motion.div
                  className={`absolute left-8 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${index <= activeIndex
                    ? "bg-primary shadow-lg shadow-primary/50"
                    : "bg-border"
                    }`}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: index <= activeIndex ? 1.25 : 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.15 + 0.3,
                    type: "spring"
                  }}
                  whileHover={{ scale: 1.4, rotate: 360 }}
                >
                  <motion.span
                    className={`text-sm ${index <= activeIndex ? "opacity-100" : "opacity-0"
                      }`}
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  >
                    {step.icon}
                  </motion.span>
                </motion.div>

                <div className="ml-20">
                  <motion.div
                    className={`bg-card border rounded-xl p-6 transition-all duration-500 ${index <= activeIndex
                      ? "border-primary/50 shadow-lg shadow-primary/10"
                      : "border-border/30"
                      }`}
                    whileHover={{
                      scale: 1.02,
                      y: -5,
                      boxShadow: "0 25px 50px -12px rgba(var(--primary-rgb), 0.25)"
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1 min-w-0">
                          <motion.p
                            className="text-[10px] sm:text-sm text-primary font-semibold uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            {formatDatePeriod(step.startDate, step.endDate)}
                          </motion.p>
                          <motion.h3
                            className="text-xl sm:text-2xl font-bold text-foreground mt-2 wrap-break-word"
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            {step.title}
                          </motion.h3>
                          <motion.p
                            className="text-base text-muted-foreground mt-1"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                          >
                            {step.company}
                          </motion.p>
                        </div>
                        <motion.span
                          className="text-3xl sm:text-4xl shrink-0"
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, type: "spring" }}
                          whileHover={{ scale: 1.2, rotate: 20 }}
                        >
                          {step.icon}
                        </motion.span>
                      </div>
                    </div>

                    <motion.p
                      className="text-base text-muted-foreground leading-relaxed mb-4 text-justify line-clamp-3 lg:line-clamp-none"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      {step.description}
                    </motion.p>

                    <div className="hidden lg:flex flex-wrap gap-2">
                      {step.highlights.map((tech: string, i: number) => (
                        <motion.span
                          key={i}
                          className={`px-3 py-1 text-sm rounded-full transition-all duration-500 ${index <= activeIndex
                            ? "bg-primary/10 border border-primary/30 text-primary"
                            : "bg-border/50 border border-border/30 text-muted-foreground"
                            }`}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.6 + i * 0.05 }}
                          whileHover={{
                            scale: 1.1,
                            y: -3,
                            backgroundColor: "rgba(var(--primary-rgb), 0.2)"
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    <div className="lg:hidden relative">
                      <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 pb-2">
                          {step.highlights.map((tech: string, i: number) => (
                            <span
                              key={i}
                              className={`shrink-0 px-3 py-1 text-sm rounded-full transition-all duration-500 ${index <= activeIndex
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
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
