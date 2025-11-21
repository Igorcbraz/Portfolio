"use client"

import { useState, useEffect } from "react"
import articlesData from "@/data/articles.json"

interface Article {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: string
  link: string
  category: string
}

export function Articles() {
  const [articles, setArticles] = useState<Article[]>([])

  useEffect(() => {
    setArticles(articlesData.articles)
  }, [])

  const formatDate = (dateString: string): string => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const [year, month] = dateString.split('-')
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <section className="relative py-20 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute right-1/4 top-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"></div>
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Artigos & <span className="text-primary">Blog</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Pensamentos e insights sobre web development, design e tecnologia
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {articles.map((article) => (
            <a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border/30 rounded-lg p-6 hover:border-primary/50 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
                  <span className="text-xs text-primary font-medium">{article.readTime}</span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight flex-1">
                    {article.title}
                  </h3>
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 shrink-0">
                    {article.category}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{article.excerpt}</p>

                <div className="flex items-center justify-between pt-4 border-t border-border/20">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Ler Artigo</span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
