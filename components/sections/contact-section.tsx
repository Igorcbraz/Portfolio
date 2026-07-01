"use client"

import { useState, useRef } from "react"
import { m } from "framer-motion"
import { Github, Linkedin, FileDown, Code2, Sparkles } from "lucide-react"
import metadata from "@/data/metadata.json"
import { analytics } from "@/lib/analytics"
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { useInView, useParallax, fadeInUp, staggerContainer } from "@/hooks/use-animations"
import { SplitText } from "@/components/ui/split-text"
import { DecryptedText } from "@/components/ui/decrypted-text"
import { BlurText } from "@/components/ui/blur-text"

interface ContactCardProps {
  href?: string
  onClick?: () => void
  idx: number
  ghostLabel: string
  className?: string
  outerClassName?: string
  children: React.ReactNode
  variants?: any
  theme?: "primary" | "blue"
}

function ContactCard({
  href,
  onClick,
  idx,
  ghostLabel,
  className = "",
  outerClassName = "",
  children,
  variants,
  theme = "primary"
}: ContactCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const cardRectRef = useRef<DOMRect | null>(null)

  const handleMouseEnter = () => {
    if (cardRef.current) {
      cardRectRef.current = cardRef.current.getBoundingClientRect()
    }
  }

  const handleMouseMove = (e: React.MouseEvent<any>) => {
    const card = cardRef.current
    if (!card) return
    const rect = cardRectRef.current || card.getBoundingClientRect()
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    const tx = -ny * 4
    const ty = nx * 4
    card.style.transform = `perspective(1200px) rotateX(${tx}deg) rotateY(${ty}deg)`
  }

  const handleMouseLeave = () => {
    cardRectRef.current = null
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)"
    }
  }

  const CardWrapper = href ? "a" : "div"

  const wrapperProps = href ? {
    href,
    target: "_blank",
    rel: "noopener noreferrer",
  } : {}

  const sweepColor = theme === "blue"
    ? "bg-[linear-gradient(90deg,transparent,oklch(0.53_0.17_247.2/0.8),transparent)]"
    : "bg-[linear-gradient(90deg,transparent,oklch(0.62_0.22_41.1/0.8),transparent)]"

  const glowColor = theme === "blue"
    ? "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.53_0.17_247.2/0.1),transparent_70%)]"
    : "bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.62_0.22_41.1/0.06),transparent_70%)]"

  const bracketBorderColor = theme === "blue"
    ? "border-[oklch(0.53_0.17_247.2)]"
    : "border-primary"

  return (
    <div className={`h-full ${outerClassName}`}>
      <m.div
        variants={variants}
        className="h-full w-full"
      >
        <CardWrapper
          ref={cardRef as any}
          {...wrapperProps}
          onClick={onClick}
          className={`group relative overflow-hidden p-8 flex flex-col justify-between rounded-none cursor-pointer cursor-target select-none transition-all duration-300 h-full ${className}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
        >
          <div className={`absolute top-0 left-0 right-0 h-px scale-x-0 group-hover:scale-x-100 transition-transform duration-700 z-30 pointer-events-none ${sweepColor}`} />

          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10 ${glowColor}`} />

          <div className="absolute inset-0 pointer-events-none z-20 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
            <div className={`absolute top-0 left-0 w-3 h-3 border-t border-l ${bracketBorderColor}`} />
            <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${bracketBorderColor}`} />
            <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${bracketBorderColor}`} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b border-r ${bracketBorderColor}`} />
          </div>

          <div
            className="absolute select-none pointer-events-none font-display font-extrabold top-[-4%] right-[-2%] leading-none tracking-[-0.05em] z-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.03)_0%,transparent_80%)] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] tabular-nums"
            style={{ fontSize: "clamp(80px,10vw,120px)" }}
          >
            {ghostLabel}
          </div>

          <div className="relative z-10 flex flex-col h-full justify-between gap-6">
            {children}
          </div>
        </CardWrapper>
      </m.div>
    </div>
  )
}

export function ContactSection() {
  const { dictionary, locale } = useLocale()
  const { isExpanded, setIsExpanded } = useVSCode()
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.1, triggerOnce: true })
  const { ref: parallaxRef, offset } = useParallax(0.2)

  const linkedinUrl = metadata.social.linkedin.url
  const githubUrl = metadata.social.github.url
  const cvUrl = locale === "pt"
    ? "https://drive.google.com/file/d/1E-Vddik2jp6DBjU2skDewbwcqQJTvTH3/view?usp=sharing"
    : "https://drive.google.com/file/d/1SUqrci8jjp7RiUsrnj9u_WPlhWlT61YG/view?usp=sharing"

  const titleParts = dictionary.contact.connectTitle.split(dictionary.contact.connectHighlight)
  const before = titleParts[0]
  const after = titleParts.slice(1).join(dictionary.contact.connectHighlight)

  return (
    <section id="contact" className="relative min-h-screen py-24 bg-background overflow-hidden border-t border-white/4">
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes contact-scan {
          0%   { transform: translateY(-100%); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        .contact-scanline {
          position: absolute;
          left: 0; top: 0;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, transparent, oklch(0.62 0.22 41.1 / 0.12), transparent);
          animation: contact-scan 12s linear infinite;
          pointer-events: none;
          z-index: 1;
        }
        @keyframes blue-glow-pulse {
          0%, 100% {
            border-color: oklch(0.53 0.17 247.2 / 0.3);
            box-shadow: 0 0 20px -5px oklch(0.53 0.17 247.2 / 0.15);
          }
          50% {
            border-color: oklch(0.53 0.17 247.2 / 0.65);
            box-shadow: 0 0 35px 2px oklch(0.53 0.17 247.2 / 0.35);
          }
        }
        .ide-pulse-card {
          animation: blue-glow-pulse 3s infinite ease-in-out;
        }
        @keyframes laser-sweep {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        .laser-scanner {
          position: absolute;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, oklch(0.53 0.17 247.2), oklch(0.53 0.17 247.2), transparent);
          box-shadow: 0 0 15px 3px oklch(0.53 0.17 247.2 / 0.9);
          animation: laser-sweep 4s infinite linear;
          pointer-events: none;
          z-index: 15;
        }
        @keyframes shift-gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animated-blue-reactor {
          background: linear-gradient(-45deg, oklch(0.18 0.08 247.2), oklch(0.10 0.04 247.2), oklch(0.15 0.06 247.2 / 0.6), oklch(0.08 0.03 247.2));
          background-size: 400% 400%;
          animation: shift-gradient 10s infinite ease;
          border: 1px solid oklch(0.53 0.17 247.2 / 0.5) !important;
          box-shadow: 0 0 35px -5px oklch(0.53 0.17 247.2 / 0.3), inset 0 0 25px oklch(0.53 0.17 247.2 / 0.15);
        }
        @keyframes beacon-ping {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        .blue-beacon {
          position: relative;
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: oklch(0.53 0.17 247.2);
          box-shadow: 0 0 8px oklch(0.53 0.17 247.2);
        }
        .blue-beacon::after {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          border-radius: 50%;
          background-color: oklch(0.53 0.17 247.2);
          animation: beacon-ping 1.8s infinite cubic-bezier(0.215, 0.610, 0.355, 1);
        }
      `}} />

      <div ref={parallaxRef} className="absolute inset-0 pointer-events-none select-none z-0">
        <div className="absolute inset-0 hero-grid-pattern opacity-40" />

        <m.div
          className="absolute inset-0 bg-linear-to-t from-primary/2 to-transparent"
          style={{ y: offset }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, var(--background) 100%)"
          }}
        />

        <div className="contact-scanline" />

        <m.div
          className="absolute top-20 right-[10%] w-96 h-96 bg-[oklch(0.62_0.22_41.1/0.12)] rounded-full blur-[120px]"
          style={{ willChange: "transform, opacity" }}
          animate={{
            y: [0, 30, 0],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <m.div
          className="absolute bottom-20 left-[10%] w-80 h-80 bg-[oklch(0.55_0.18_260/0.07)] rounded-full blur-[100px]"
          style={{ willChange: "transform, opacity" }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="absolute top-8 left-8 font-mono text-[9px] text-muted-foreground/40 pointer-events-none select-none hidden md:block leading-relaxed z-10">
        <div><DecryptedText text="SYS_STATUS: ACTIVE" speed={25} delay={500} className="text-muted-foreground/40" /></div>
        <div className="flex items-center gap-1.5">
          <DecryptedText text="UPLINK: SECURE" speed={25} delay={650} className="text-muted-foreground/40" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ boxShadow: "0 0 6px oklch(0.62 0.22 41.1)" }} />
        </div>
      </div>

      <div className="absolute bottom-8 right-8 font-mono text-[9px] text-muted-foreground/40 pointer-events-none select-none hidden md:block text-right leading-relaxed z-10">
        <div><DecryptedText text="PORTFOLIO.TELEMETRY v2.1" speed={25} delay={600} className="text-muted-foreground/40" /></div>
        <div><DecryptedText text="TRANSMISSION: READY" speed={25} delay={750} className="text-muted-foreground/40" /></div>
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-between">

        <div className="text-center mb-16 flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="w-8 h-px bg-primary" />
            <span className="text-[11px] font-semibold text-primary uppercase tracking-[0.25em] font-display">
              <DecryptedText
                text={dictionary.navigation.contact}
                speed={30}
                delay={0}
                className="text-primary"
              />
            </span>
            <div className="w-8 h-px bg-primary" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-[0.95] text-foreground mb-6">
            <SplitText
              text={before}
              splitType="words"
              stepDelay={65}
              delay={0}
              threshold={0.1}
            />
            <span className="bg-[linear-gradient(90deg,oklch(0.62_0.22_41.1),oklch(0.82_0.20_75),oklch(0.62_0.22_41.1))] bg-size-[200%_auto] bg-clip-text text-transparent [-webkit-text-fill-color:transparent] [-webkit-background-clip:text] animate-[shimmer_4s_linear_infinite] inline-block">
              {dictionary.contact.connectHighlight}
            </span>
            <SplitText
              text={after}
              splitType="words"
              stepDelay={65}
              delay={0}
              threshold={0.1}
            />
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl font-sans leading-relaxed">
            <BlurText
              text={dictionary.contact.subtitle}
              animateBy="words"
              direction="top"
              delay={0}
              stepDelay={28}
              className="text-muted-foreground"
              threshold={0.1}
            />
          </p>
        </div>

        <m.div
          className="flex flex-col gap-10 max-w-5xl mx-auto w-full"
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
        >

          <div className="w-full">
            <div className="flex items-center gap-3 font-mono text-[10px] text-primary/60 uppercase tracking-[0.25em] px-1 mb-6">
              <span className="w-1.5 h-1.5 bg-primary" />
              <span>CONTACTS_&_RESOURCES</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            <div
              className="grid md:grid-cols-3 gap-6 w-full items-stretch"
            >
              <ContactCard
                href={linkedinUrl}
                idx={0}
                ghostLabel="LN"
                variants={fadeInUp}
                outerClassName="md:translate-y-2 md:scale-[0.97] hover:opacity-100 md:hover:translate-y-0 md:hover:scale-[1.0] transition-all duration-300 z-0 hover:z-10"
                className="bg-card border-border/60 hover:border-primary/45 hover:bg-card/95"
                onClick={() => analytics.trackSocialClick('LinkedIn')}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/[0.07] border border-primary/20 text-primary">
                    <Linkedin className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">
                    {dictionary.contact.linkedinLabel}
                  </p>
                  <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                    Igor Braz
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {dictionary.contact.linkedinSubtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-primary border-t border-white/6 pt-4 mt-2">
                  <span>CONNECT_SECURELY</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </ContactCard>


              <ContactCard
                idx={2}
                ghostLabel="CV"
                variants={fadeInUp}
                outerClassName="md:-translate-y-4 md:scale-[1.04] transition-all duration-300 z-10 md:hover:-translate-y-6 md:hover:scale-[1.06] hover:z-20"
                className="bg-card border-primary/30 shadow-[0_20px_50px_-12px_oklch(0.62_0.22_41.1/0.15)] hover:border-primary/60 hover:bg-card/95"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/[0.07] border border-primary/20 text-primary">
                    <FileDown className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">
                    CURRICULUM VITAE
                  </p>
                  <h3 className="text-xl font-bold font-display text-foreground mb-1.5 leading-tight">
                    {dictionary.contact.cvTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {dictionary.contact.cvText}
                  </p>
                </div>

                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full block mt-2"
                  onClick={() => analytics.trackDownload('Curriculum Vitae')}
                >
                  <div className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-primary text-black font-display font-semibold text-[0.925rem] rounded-none transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_oklch(0.62_0.22_41.1/0.5)] cursor-pointer cursor-target">
                    <FileDown className="w-4 h-4" />
                    <span>{dictionary.contact.cvButton}</span>
                  </div>
                </a>
              </ContactCard>

              <ContactCard
                href={githubUrl}
                idx={1}
                ghostLabel="GH"
                variants={fadeInUp}
                outerClassName="md:translate-y-2 md:scale-[0.97] hover:opacity-100 md:hover:translate-y-0 md:hover:scale-[1.0] transition-all duration-300 z-0 hover:z-10"
                className="bg-card border-border/60 hover:border-primary/45 hover:bg-card/95"
                onClick={() => analytics.trackSocialClick('GitHub')}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 bg-primary/[0.07] border border-primary/20 text-primary">
                    <Github className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/40 uppercase tracking-widest">
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-mono text-primary uppercase tracking-widest mb-1">
                    {dictionary.contact.githubLabel}
                  </p>
                  <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                    Igorcbraz
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {dictionary.contact.githubSubtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-primary border-t border-white/6 pt-4 mt-2">
                  <span>BROWSE_REPOSITORIES</span>
                  <span className="group-hover:translate-x-1.5 transition-transform duration-300">→</span>
                </div>
              </ContactCard>

            </div>
          </div>

          <div className="w-full">

            <m.div
              variants={fadeInUp}
            >
              <ContactCard
                idx={3}
                ghostLabel="IDE"
                theme="blue"
                onClick={() => {
                  analytics.trackIDEInteraction(isExpanded ? "close" : "open", "ContactSection");
                  setIsExpanded(!isExpanded);
                }}
                className={`transition-all duration-300 relative overflow-hidden ${isExpanded
                  ? 'bg-card border-border hover:border-[oklch(0.53_0.17_247.2/0.5)]'
                  : 'animated-blue-reactor hover:border-[oklch(0.53_0.17_247.2/1.0)] hover:shadow-[0_25px_60px_-8px_oklch(0.53_0.17_247.2/0.55)] md:hover:scale-[1.015]'
                  }`}
              >

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">

                  <div className="flex flex-col md:flex-row items-start gap-6 max-w-2xl">
                    <div className="p-4 border transition-colors duration-300 shrink-0 bg-[oklch(0.53_0.17_247.2/0.1)] border-[oklch(0.53_0.17_247.2/0.3)] text-[oklch(0.53_0.17_247.2)]">
                      {isExpanded ? (
                        <Sparkles className="w-8 h-8 animate-pulse" />
                      ) : (
                        <Code2 className="w-8 h-8 animate-pulse" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {!isExpanded && <span className="blue-beacon shrink-0" />}
                        <p className="text-[10px] font-mono uppercase tracking-widest transition-colors duration-300 text-[oklch(0.53_0.17_247.2)] font-semibold">
                        </p>
                      </div>
                      <h3 className="text-xl font-bold font-display text-foreground mb-1.5 leading-tight">
                        {isExpanded ? dictionary.footer.ideTitle : dictionary.footer.ideOpenTitle}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isExpanded ? dictionary.footer.ideSubtitle : dictionary.footer.ideOpenSubtitle}
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0 md:min-w-60">
                    <div
                      className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 font-display font-semibold text-[0.925rem] rounded-none transition-all duration-300 bg-[oklch(0.53_0.17_247.2/0.15)] border border-[oklch(0.53_0.17_247.2/0.5)] text-white shadow-[0_0_15px_-3px_oklch(0.53_0.17_247.2/0.3)] group-hover:bg-[oklch(0.53_0.17_247.2)] group-hover:text-white group-hover:shadow-[0_12px_40px_-8px_oklch(0.53_0.17_247.2/0.6)] cursor-pointer cursor-target"
                    >
                      {isExpanded ? (
                        <Code2 className="w-4 h-4" />
                      ) : (
                        <Sparkles className="w-4 h-4" />
                      )}
                      <span>
                        {isExpanded ? dictionary.footer.ideButton : dictionary.footer.ideCloseButton}
                      </span>
                    </div>
                  </div>

                </div>
              </ContactCard>
            </m.div>
          </div>

        </m.div>

        <div className="mt-20 flex items-center gap-4 w-full">
          <div className="flex-1 h-px bg-[linear-gradient(to_right,oklch(0.62_0.22_41.1/0.3),transparent)]" />
          <span className="text-[10px] font-mono text-muted-foreground/30 tracking-widest uppercase">
          </span>
          <div className="flex-1 h-px bg-[linear-gradient(to_left,oklch(0.62_0.22_41.1/0.3),transparent)]" />
        </div>

      </div>
    </section>
  )
}
