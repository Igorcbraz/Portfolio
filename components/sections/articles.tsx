"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useLocale } from "@/contexts/LocaleContext"
import { getArticles } from '@/lib/data'
import { useInView } from "@/hooks/use-animations"

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
  const { dictionary, locale } = useLocale()
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    setArticles(getArticles(locale) as Article[])
  }, [locale])

  const formatDate = (dateString: string): string => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
    const [year, month] = dateString.split('-')
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <section ref={sectionRef} className="relative py-20 bg-background">
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="absolute right-1/4 top-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-16"
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
              {dictionary.articles.title.split(" & ")[0]}
            </motion.span>{" & "}
            <motion.span
              className="text-primary inline-block"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.4, duration: 0.6, ease: "backOut" }}
            >
              {dictionary.articles.title.split(" & ")[1]}
            </motion.span>
          </h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {dictionary.articles.subtitle}
          </motion.p>
        </motion.div>
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6"
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.8
              }
            }
          }}
        >
          {articles.map((article, idx) => (
            <motion.a
              key={article.id}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-card border border-border/30 rounded-lg p-6 hover:border-primary/50 hover:bg-card/80 transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
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
                boxShadow: "0 20px 40px -12px rgba(var(--primary-rgb), 0.2)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <motion.span
                    className="text-xs text-muted-foreground"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    {formatDate(article.date)}
                  </motion.span>
                  <motion.span
                    className="text-xs text-primary font-medium"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring" }}
                  >
                    {article.readTime}
                  </motion.span>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <motion.h3
                    className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight flex-1"
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    {article.title}
                  </motion.h3>
                  <motion.span
                    className="text-xs px-2 py-1 bg-primary/10 text-primary rounded border border-primary/20 shrink-0"
                    initial={{ opacity: 0, rotate: -10, scale: 0 }}
                    whileInView={{ opacity: 1, rotate: 0, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {article.category}
                  </motion.span>
                </div>

                <motion.p
                  className="text-sm text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  {article.excerpt}
                </motion.p>

                <motion.div
                  className="flex items-center justify-between pt-4 border-t border-border/20"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{dictionary.articles.read}</span>
                  <motion.span
                    className="text-primary"
                    initial={{ x: -10, opacity: 0 }}
                    whileHover={{ x: 5, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    →
                  </motion.span>
                </motion.div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
