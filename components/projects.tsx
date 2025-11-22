"use client"

import { useState, useEffect } from "react"
import { sendGAEvent } from '@next/third-parties/google'
import projectsData from "@/data/projects.json"

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
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    setProjects(projectsData.projects)
  }, [])

  const categories = Array.from(new Set(projects.map((p) => p.category)))
  const filteredProjects = activeCategory ? projects.filter((p) => p.category === activeCategory) : projects

  return (
    <section className="relative min-h-screen py-20 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/4 top-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Projetos <span className="text-primary">Profissionais</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Trabalhos reais em produção, demonstrando minha atuação em desenvolvimento de software
          </p>
        </div>

        <div className="relative mb-12">
          <div className="lg:hidden overflow-x-auto scrollbar-hide">
            <div className="flex gap-3 pb-2">
              <button
                onClick={() => {
                  sendGAEvent('event', 'projects_all_click', { label: 'All Projects' });
                  setActiveCategory(null);
                }}
                className={`shrink-0 px-6 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === null
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    sendGAEvent('event', 'projects_category_click', { label: cat });
                    setActiveCategory(cat);
                  }}
                  className={`shrink-0 px-6 py-2 rounded-lg font-medium transition-all ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                      : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-wrap gap-3">
            <button
              onClick={() => {
                sendGAEvent('event', 'projects_all_click', { label: 'All Projects' });
                setActiveCategory(null);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeCategory === null
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  sendGAEvent('event', 'projects_category_click', { label: cat });
                  setActiveCategory(cat);
                }}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                    : "bg-card border border-border/30 text-muted-foreground hover:border-primary/50 hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="lg:hidden absolute top-0 right-0 bottom-0 w-8 bg-linear-to-l from-background to-transparent pointer-events-none"></div>
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

        <div className="grid sm:grid-cols-2 gap-6">
          {filteredProjects.map((project) => (
            <a
              key={project.id}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-border/30 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="relative h-64 overflow-hidden bg-card">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent group-hover:from-background/80 transition-all"></div>

                {project.featured && (
                  <div className="absolute top-4 right-4 px-3 py-1 bg-primary/90 backdrop-blur-sm text-primary-foreground text-xs font-semibold rounded-full">
                    Em Produção
                  </div>
                )}
              </div>

              <div className="relative p-6 bg-card space-y-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-primary uppercase tracking-widest">
                    {project.category}
                  </span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">↗</span>
                </div>

                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>

                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 py-4 border-t border-b border-border/20">
                    {project.metrics.map((metric, i) => (
                      <div key={i} className="text-center group/metric" title={metric.description}>
                        <p className="text-xl sm:text-2xl font-bold text-primary">{metric.value}</p>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider leading-tight">{metric.label}</p>
                        <p className="hidden lg:block text-[9px] text-muted-foreground/70 mt-1 opacity-0 group-hover/metric:opacity-100 transition-opacity">{metric.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {project.highlights && project.highlights.length > 0 && (
                  <div className="space-y-2">
                    <ul className="space-y-1">
                      {project.highlights.slice(0, 4).map((highlight, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="hidden lg:flex flex-wrap gap-2">
                    {project.technologies.map((tech, i) => (
                      <span key={i} className="px-2 py-1 bg-muted/50 text-muted-foreground text-[10px] rounded border border-border/30">
                        {tech}
                      </span>
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
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
