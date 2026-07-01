"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { m } from "framer-motion"
import { useLocale } from "@/contexts/LocaleContext"
import { getArticles } from '@/lib/data'
import { useInView } from "@/hooks/use-animations"
import { SplitText } from "@/components/ui/split-text"
import { DecryptedText } from "@/components/ui/decrypted-text"
import { BlurText } from "@/components/ui/blur-text"

interface Article {
  id: number
  title: string
  excerpt: string
  date: string
  readTime: string
  link: string
  category: string
}

function ArticleCard({ article, idx, isInView }: { article: Article; idx: number; isInView: boolean }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const cardRectRef = useRef<DOMRect | null>(null)
  const [hovered, setHovered] = useState(false)

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    if (cardRef.current) {
      cardRectRef.current = cardRef.current.getBoundingClientRect()
    }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = cardRectRef.current || (cardRef.current ? cardRef.current.getBoundingClientRect() : null)
    if (!rect) return
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    const tx = -ny * 4
    const ty = nx * 4
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(1200px) rotateX(${tx}deg) rotateY(${ty}deg)`
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    cardRectRef.current = null
    setHovered(false)
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)"
    }
  }, [])

  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const formatDate = (dateString: string): string => {
    const [year, month] = dateString.split('-')
    return `${months[parseInt(month) - 1]} ${year}`
  }

  return (
    <m.a
      ref={cardRef}
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative group block overflow-hidden bg-[oklch(0.12_0_0)] border border-[oklch(0.18_0_0)] cursor-none"
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay: 0.8 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={handleMouseEnter}
      style={{
        transition: hovered ? 'transform 80ms linear' : 'transform 400ms cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px bg-[linear-gradient(90deg,transparent,oklch(0.62_0.22_41.1),transparent)] origin-left pointer-events-none z-20"
        style={{
          transform: hovered ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 700ms cubic-bezier(0.16,1,0.3,1)',
        }}
      />

      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.62_0.22_41.1/0.06),transparent)]"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 300ms ease' }}
      />

      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: hovered
            ? 'inset 0 0 0 1px oklch(0.62 0.22 41.1 / 0.25)'
            : 'inset 0 0 0 1px transparent',
          transition: 'box-shadow 300ms ease',
        }}
      />

      {[
        'top-2 left-2 border-t border-l',
        'top-2 right-2 border-t border-r',
        'bottom-2 left-2 border-b border-l',
        'bottom-2 right-2 border-b border-r',
      ].map((pos, i) => (
        <div
          key={i}
          className={`absolute w-3 h-3 pointer-events-none z-20 border-[oklch(0.62_0.22_41.1/0.6)] ${pos}`}
          style={{ opacity: hovered ? 1 : 0, transition: `opacity 200ms ease ${i * 30}ms` }}
        />
      ))}

      <div
        className="absolute select-none pointer-events-none font-display font-extrabold top-[-4%] right-[-2%] leading-none tracking-[-0.05em] z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,transparent_80%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] tabular-nums"
        style={{ fontSize: 'clamp(80px, 10vw, 140px)' }}
      >
        {String(idx + 1).padStart(2, '0')}
      </div>

      <div className="relative z-10 p-5 space-y-3">

        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {formatDate(article.date)}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 bg-[oklch(0.62_0.22_41.1/0.07)] border border-[oklch(0.62_0.22_41.1/0.20)] text-primary uppercase tracking-widest">
            {article.category}
          </span>
        </div>

        <h3
          className="text-base font-bold font-display leading-tight text-foreground group-hover:text-primary transition-colors duration-150"
        >
          {hovered ? <DecryptedText text={article.title} speed={30} className="text-primary" /> : article.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {article.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-[oklch(0.18_0_0)]">
          <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-widest">
            {article.readTime}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              READ
            </span>
            <span
              className="text-primary font-mono text-sm"
              style={{
                transform: hovered ? 'translateX(4px)' : 'translateX(-4px)',
                opacity: hovered ? 1 : 0.4,
                transition: 'transform 250ms ease, opacity 250ms ease',
              }}
            >
              →
            </span>
          </div>
        </div>
      </div>
    </m.a>
  )
}

// ─── Articles Section ──────────────────────────────────────────────────────────

export function Articles() {
  const [articles, setArticles] = useState<Article[]>([])
  const { dictionary, locale } = useLocale()
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    setArticles(getArticles(locale) as Article[])
  }, [locale])

  return (
    <section 
      ref={sectionRef} 
      className="relative py-24 overflow-hidden bg-background"
    >
      <style>{`
        @keyframes art-scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .art-scanline {
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, oklch(0.62 0.22 41.1 / 0.15), transparent);
          animation: art-scan 10s linear infinite;
          pointer-events: none;
          z-index: 2;
        }
        @keyframes art-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .art-blink { animation: art-blink 1.2s step-start infinite; }
      `}</style>

      <div className="absolute inset-0 hero-grid-pattern pointer-events-none" />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_40%,var(--background)_100%)]" />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,transparent_40%,var(--background)_100%)]" />

      <div className="absolute pointer-events-none top-[-5%] right-[5%] w-[55vw] h-[55vw] max-w-[700px] max-h-[700px] bg-[radial-gradient(circle,oklch(0.62_0.22_41.1/0.12)_0%,transparent_70%)] rounded-full blur-[80px] animate-[pulse_9s_ease-in-out_infinite]" />

      <div className="absolute pointer-events-none bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] max-w-[650px] max-h-[650px] bg-[radial-gradient(circle,oklch(0.55_0.18_260/0.07)_0%,transparent_70%)] rounded-full blur-[80px] animate-[pulse_12s_ease-in-out_infinite] [animation-delay:3s]" />

      <div className="art-scanline" />

      <div className="absolute left-0 top-0 bottom-0 w-px pointer-events-none bg-[linear-gradient(to_bottom,transparent,oklch(0.62_0.22_41.1/0.3),transparent)]" />
      <div className="absolute right-0 top-0 bottom-0 w-px pointer-events-none bg-[linear-gradient(to_bottom,transparent,oklch(0.62_0.22_41.1/0.3),transparent)]" />

      <m.div
        className="absolute top-5 left-5 z-10 pointer-events-none hidden xl:block"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest leading-relaxed">
          <div><DecryptedText text="SEC-05 // ART" speed={25} delay={400} className="text-primary/60" /></div>
          <div><DecryptedText text="RENDER MODE: GRID" speed={25} delay={550} className="text-muted-foreground/40" /></div>
          <div className="flex items-center gap-1">
            <DecryptedText text="STATUS: ACTIVE" speed={25} delay={700} className="text-muted-foreground/40" />
            <span className="art-blink text-primary">▮</span>
          </div>
        </div>
      </m.div>

      <m.div
        className="absolute bottom-5 right-5 z-10 pointer-events-none hidden xl:flex items-end gap-3"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <span className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-widest">
          PORTFOLIO.ARTICLES v1.0 // 2026
        </span>
        <div className="w-px h-6 bg-[oklch(0.62_0.22_41.1/0.3)]" />
      </m.div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.25em] font-display">
              <DecryptedText
                text={dictionary.articles.sectionLabel}
                speed={30}
                delay={0}
                className="text-primary"
              />
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[0.95]">
            <SplitText
              text={dictionary.articles.title}
              splitType="words"
              stepDelay={60}
              delay={0}
              threshold={0.1}
            />{' '}
            <span className="bg-[linear-gradient(90deg,oklch(0.62_0.22_41.1),oklch(0.82_0.20_75),oklch(0.62_0.22_41.1))] bg-size-[200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] animate-[shimmer_4s_linear_infinite]">
              & {dictionary.articles.titleHighlight}
            </span>
          </h2>

          <p className="mt-4 text-sm text-muted-foreground max-w-xl leading-relaxed">
            <BlurText
              text={dictionary.articles.subtitle}
              animateBy="words"
              direction="top"
              delay={0}
              stepDelay={30}
              className="text-muted-foreground"
              threshold={0.1}
            />
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {articles.map((article, idx) => (
            <ArticleCard
              key={article.id}
              article={article}
              idx={idx}
              isInView={isInView}
            />
          ))}
        </div>

        <m.div
          className="mt-16 flex items-center gap-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <div className="flex-1 h-px bg-[linear-gradient(to_right,oklch(0.62_0.22_41.1/0.4),transparent)]" />
          <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest uppercase">
            END // SEC-05
          </span>
          <div className="flex-1 h-px bg-[linear-gradient(to_left,oklch(0.62_0.22_41.1/0.4),transparent)]" />
        </m.div>
      </div>
    </section>
  )
}
