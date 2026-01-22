"use client"

import { motion } from "framer-motion"
import { Github, Linkedin, FileDown, Code2, Sparkles } from "lucide-react"
import metadata from "@/data/metadata.json"
import { sendGAEvent } from '@next/third-parties/google'
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { useInView, useParallax, fadeInUp, staggerContainer } from "@/hooks/use-animations"

export function ContactSection() {
  const { dictionary } = useLocale()
  const { isExpanded, setIsExpanded } = useVSCode()
  const { ref: sectionRef, isInView } = useInView({ threshold: 0.2, triggerOnce: true })
  const { ref: parallaxRef, offset } = useParallax(0.3)

  const linkedinUrl = metadata.social.linkedin.url
  const githubUrl = metadata.social.github.url

  return (
    <section id="contact" className="relative min-h-screen py-20 bg-background">
      <div ref={parallaxRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent"
          style={{ y: offset }}
        />
        <motion.div
          className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-80 h-80 bg-accent/10 rounded-full blur-[100px]"
          animate={{
            scale: [1.3, 1, 1.3],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div ref={sectionRef} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {dictionary.contact.connectTitle.split("Conectar").shift()} <motion.span
              className="text-primary"
              animate={{
                textShadow: [
                  "0 0 20px rgba(var(--primary-rgb), 0.5)",
                  "0 0 40px rgba(var(--primary-rgb), 0.8)",
                  "0 0 20px rgba(var(--primary-rgb), 0.5)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >{dictionary.contact.connectHighlight}</motion.span>
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {dictionary.contact.subtitle}
          </motion.p>
        </motion.div>

        <motion.div
          className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16"
          variants={staggerContainer}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
        >
          <motion.a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden p-8 rounded-xl border border-border/30 bg-card"
            variants={fadeInUp}
            whileHover={{
              y: -12,
              scale: 1.05,
              borderColor: "rgba(var(--primary-rgb), 0.5)",
              boxShadow: "0 25px 50px -12px rgba(var(--primary-rgb), 0.25)",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => sendGAEvent('event', 'contact_linkedin_click', { label: 'LinkedIn' })}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="relative z-10 flex items-center gap-6">
              <motion.div
                className="p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                whileHover={{
                  rotate: [0, -10, 10, -10, 0],
                  scale: 1.1
                }}
                transition={{ duration: 0.6 }}
              >
                <Linkedin className="w-8 h-8" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{dictionary.contact.linkedinLabel}</p>
                <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  Igor Braz
                </p>
                <p className="text-sm text-muted-foreground">{dictionary.contact.linkedinSubtitle}</p>
              </div>
              <motion.span
                className="text-primary"
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 5 }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            </div>
          </motion.a>

          <motion.a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden p-8 rounded-xl border border-border/30 bg-card"
            variants={fadeInUp}
            whileHover={{
              y: -12,
              scale: 1.05,
              borderColor: "rgba(var(--primary-rgb), 0.5)",
              boxShadow: "0 25px 50px -12px rgba(var(--primary-rgb), 0.25)",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => sendGAEvent('event', 'contact_github_click', { label: 'GitHub' })}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent"
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            />
            <div className="relative z-10 flex items-center gap-6">
              <motion.div
                className="p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                whileHover={{
                  rotate: [0, 10, -10, 10, 0],
                  scale: 1.1
                }}
                transition={{ duration: 0.6 }}
              >
                <Github className="w-8 h-8" />
              </motion.div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{dictionary.contact.githubLabel}</p>
                <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  Igorcbraz
                </p>
                <p className="text-sm text-muted-foreground">{dictionary.contact.githubSubtitle}</p>
              </div>
              <motion.span
                className="text-primary"
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 5 }}
                transition={{ duration: 0.3 }}
              >
                →
              </motion.span>
            </div>
          </motion.a>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-20 md:items-stretch md:grid-rows-1 md:max-h-[280px]"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="md:col-span-2 relative overflow-hidden rounded-3xl border-2 border-border/50 bg-card p-6 md:p-8 flex flex-col justify-between h-full"
            whileHover={{
              y: -8,
              scale: 1.02,
              borderColor: "rgba(var(--primary-rgb), 0.4)",
              boxShadow: "0 30px 60px -15px rgba(var(--primary-rgb), 0.3)",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent"
              animate={{
                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="flex items-start justify-between mb-3">
                  <motion.div
                    className="p-3 rounded-xl bg-primary/20 text-primary"
                    whileHover={{ rotate: 360, scale: 1.15 }}
                    transition={{ duration: 0.6 }}
                  >
                    <FileDown className="w-6 h-6" />
                  </motion.div>
                  <motion.span
                    className="text-xs font-bold text-primary uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary/10"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    PDF
                  </motion.span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-foreground mb-2 leading-tight">
                  {dictionary.contact.cvTitle}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-xl">
                  {dictionary.contact.cvText}
                </p>
              </div>

              <motion.a
                href="https://drive.google.com/file/d/1E-Vddik2jp6DBjU2skDewbwcqQJTvTH3/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold text-sm w-fit"
                onClick={() => sendGAEvent('event', 'contact_cv_download_click', { label: 'Download CV' })}
                whileHover={{
                  scale: 1.1,
                  boxShadow: "0 20px 40px -10px rgba(var(--primary-rgb), 0.5)",
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <FileDown className="w-4 h-4" />
                <span>{dictionary.contact.cvButton}</span>
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            className="relative overflow-hidden rounded-3xl border border-[#007acc]/30 bg-linear-to-br from-[#007acc]/10 via-background to-background p-6 h-full"
            whileHover={{
              y: -8,
              scale: 1.02,
              borderColor: "rgba(0, 122, 204, 0.5)",
              boxShadow: "0 30px 60px -15px rgba(0, 122, 204, 0.3)",
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-0 right-0 w-96 h-96 bg-[#007acc]/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.5, 1],
                  x: [0, 30, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-80 h-80 bg-[#4ec9b0]/10 rounded-full blur-3xl"
                animate={{
                  scale: [1.5, 1, 1.5],
                  x: [0, -30, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-start justify-between mb-4">
                <motion.div
                  animate={{
                    rotate: isExpanded ? 360 : 0,
                    scale: isExpanded ? 1.1 : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {isExpanded ? (
                    <Sparkles className="w-7 h-7 text-[#007acc] animate-pulse" />
                  ) : (
                    <Code2 className="w-7 h-7 text-[#4ec9b0] animate-pulse" />
                  )}
                </motion.div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <motion.h3
                  className="text-lg font-bold text-foreground mb-2 leading-tight"
                  key={isExpanded ? "expanded" : "collapsed"}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isExpanded ? dictionary.footer.ideTitle : dictionary.footer.ideOpenTitle}
                </motion.h3>
                <motion.p
                  className="text-sm text-muted-foreground line-clamp-3 mb-4"
                  key={isExpanded ? "expanded-p" : "collapsed-p"}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {isExpanded ? dictionary.footer.ideSubtitle : dictionary.footer.ideOpenSubtitle}
                </motion.p>
              </div>

              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold cursor-pointer ${isExpanded
                  ? 'bg-[#007acc] hover:bg-[#005a9e] text-white shadow-xl shadow-[#007acc]/30'
                  : 'bg-[#4ec9b0] hover:bg-[#3da88f] text-background shadow-xl shadow-[#4ec9b0]/30'
                  }`}
                whileHover={{
                  scale: 1.05,
                  boxShadow: isExpanded
                    ? "0 30px 60px -10px rgba(0, 122, 204, 0.6)"
                    : "0 30px 60px -10px rgba(78, 201, 176, 0.6)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ rotate: isExpanded ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isExpanded ? (
                    <Code2 className="w-4 h-4" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </motion.div>
                <span className="text-sm">
                  {isExpanded ? dictionary.footer.ideButton : dictionary.footer.ideCloseButton}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
