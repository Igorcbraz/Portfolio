"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useLocale } from "@/contexts/LocaleContext"
import { sendGAEvent } from '@next/third-parties/google'
import { getProjects } from '@/lib/data'
import { useInView } from "@/hooks/use-animations"
import Image from "next/image"

interface Project {
  id: number
  title: string
  description: string
  image: string
  category: string
  highlights: string[]
  metrics?: Array<{
    label: string
    value: string
    description: string
  }>
  technologies: string[]
  link: string
  featured?: boolean
}

export function Projects() {


  const { dictionary, locale } = useLocale()
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true })

  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    setProjects(getProjects(locale) as Project[])
  }, [locale])

  const categories = Array.from(new Set(projects.map((p) => p.category)))
  const filteredProjects = activeCategory ? projects.filter((p) => p.category === activeCategory) : projects

  return (
    <section ref={sectionRef} className="relative min-h-screen py-20 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute left-1/4 top-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-block"
            >
              {dictionary.projects.title}
            </motion.span>{" "}
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Profissionais
            </motion.span>
          </h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {dictionary.projects.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="relative mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="lg:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2">
              <motion.button
                onClick={() => {
                  sendGAEvent('event', 'projects_all_click', { label: dictionary.projects.all });
                  setActiveCategory(null);
                }}
                className={`shrink-0 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${activeCategory === null
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {dictionary.projects.all}
              </motion.button>
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat}
                  onClick={() => {
                    sendGAEvent('event', 'projects_category_click', { label: cat });
                    setActiveCategory(cat);
                  }}
                  className={`shrink-0 px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.9 + idx * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-wrap gap-3">
            <motion.button
              onClick={() => {
                sendGAEvent('event', 'projects_all_click', { label: 'All Projects' });
                setActiveCategory(null);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${activeCategory === null
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              {dictionary.projects.all}
            </motion.button>
            {categories.map((cat, idx) => (
              <motion.button
                key={cat}
                onClick={() => {
                  sendGAEvent('event', 'projects_category_click', { label: cat });
                  setActiveCategory(cat);
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-all cursor-pointer ${activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          <div className="lg:hidden absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none"></div>
        </motion.div>

        <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        <motion.div
          className="grid sm:grid-cols-2 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.15
              }
            }
          }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, idx) => (
              <motion.a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 50, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(var(--primary-rgb), 0.25)",
                  transition: { duration: 0.3 }
                }}
                layout
              >
                <div className="relative aspect-16/10 overflow-hidden bg-card">
                  <Image
                    src={project.image}
                    alt={`Imagem do projeto ${project.title}: ${project.description}`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    priority={project.featured}
                    loading={project.featured ? "eager" : "lazy"}
                    fetchPriority={project.featured ? "high" : "auto"}
                    quality={project.featured ? 80 : 70}
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent group-hover:from-background/90 transition-all duration-300 pointer-events-none" />

                  {project.featured && (
                    <motion.div
                      className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-full"
                      initial={{ opacity: 0, scale: 0, rotate: -180 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ delay: 1 + idx * 0.15, duration: 0.5, ease: "backOut" }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {dictionary.projects.featured}
                    </motion.div>
                  )}
                </div>

                <div className="relative p-6 bg-card space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <motion.span
                      className="text-xs font-semibold text-primary uppercase tracking-widest"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      {project.category}
                    </motion.span>
                    <motion.span
                      className="text-primary"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1, x: 5, y: -5 }}
                    >
                      ↗
                    </motion.span>
                  </div>

                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                  {project.metrics && project.metrics.length > 0 && (
                    <motion.div
                      className="grid grid-cols-3 gap-2 sm:gap-3 py-4 border-t border-b border-border/20"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {project.metrics.map((metric: any, i: number) => (
                        <motion.div
                          key={i}
                          className="text-center group/metric"
                          title={metric.description}
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 + i * 0.1 }}
                          whileHover={{ scale: 1.1, y: -3 }}
                        >
                          <motion.p
                            className="text-xl sm:text-2xl font-bold text-primary"
                            whileHover={{ scale: 1.2 }}
                          >
                            {metric.value}
                          </motion.p>
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider leading-tight">{metric.label}</p>
                          <p className="hidden lg:block text-[9px] text-muted-foreground/70 mt-1 opacity-0 group-hover/metric:opacity-100 transition-opacity">{metric.description}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}

                  {project.highlights && project.highlights.length > 0 && (
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <ul className="space-y-1">
                        {project.highlights.slice(0, 4).map((highlight: string, i: number) => (
                          <motion.li
                            key={i}
                            className="text-xs text-muted-foreground flex items-start gap-2"
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + i * 0.05 }}
                          >
                            <motion.span
                              className="text-primary mt-0.5"
                              initial={{ scale: 0 }}
                              whileInView={{ scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.05, type: "spring" }}
                            >
                              •
                            </motion.span>
                            <span>{highlight}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <div className="hidden lg:flex flex-wrap gap-2">
                      {project.technologies.map((tech, i) => (
                        <motion.span
                          key={i}
                          className="px-2 py-1 bg-muted/50 text-muted-foreground text-[10px] rounded border border-border/30"
                          initial={{ opacity: 0, scale: 0.8 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.7 + i * 0.03 }}
                          whileHover={{
                            scale: 1.1,
                            backgroundColor: "rgba(var(--primary-rgb), 0.1)",
                            borderColor: "rgba(var(--primary-rgb), 0.5)",
                            color: "rgba(var(--primary-rgb), 1)"
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    <div className="lg:hidden relative">
                      <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex gap-2 pb-2">
                          {project.technologies.map((tech, i) => (
                            <span key={i} className="shrink-0 px-2 py-1 bg-muted/50 text-muted-foreground text-[10px] rounded border border-border/30">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-card to-transparent pointer-events-none"></div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
