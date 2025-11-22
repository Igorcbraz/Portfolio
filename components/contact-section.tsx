"use client"


import { Github, Linkedin, FileDown } from "lucide-react"
import metadata from "../data/metadata.json"
import { sendGAEvent } from '@next/third-parties/google'
import { useLocale } from "@/contexts/LocaleContext"

export function ContactSection() {
  const { dictionary } = useLocale()

  const linkedinUrl = metadata.social.linkedin.url
  const githubUrl = metadata.social.github.url

  return (
    <section id="contact" className="relative min-h-screen py-20 bg-background">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-linear-to-t from-primary/5 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {dictionary.contact.connectTitle.split("Conectar").shift()} <span className="text-primary">{dictionary.contact.connectHighlight}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {dictionary.contact.subtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden p-8 rounded-xl border border-border/30 hover:border-primary/50 bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            onClick={() => sendGAEvent('event', 'contact_linkedin_click', { label: 'LinkedIn' })}
          >
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Linkedin className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{dictionary.contact.linkedinLabel}</p>
                <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  Igor Braz
                </p>
                <p className="text-sm text-muted-foreground">{dictionary.contact.linkedinSubtitle}</p>
              </div>
              <span className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                →
              </span>
            </div>
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>

          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden p-8 rounded-xl border border-border/30 hover:border-primary/50 bg-card hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1"
            onClick={() => sendGAEvent('event', 'contact_github_click', { label: 'GitHub' })}
          >
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                <Github className="w-8 h-8" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{dictionary.contact.githubLabel}</p>
                <p className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  Igorcbraz
                </p>
                <p className="text-sm text-muted-foreground">{dictionary.contact.githubSubtitle}</p>
              </div>
              <span className="text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                →
              </span>
            </div>
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </a>
        </div>

        <div className="max-w-2xl mx-auto mt-20">
          <div className="relative overflow-hidden rounded-2xl border border-border/30 bg-card p-12">
            <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent"></div>

            <div className="relative z-10 text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-2">
                <FileDown className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  {dictionary.contact.cvTitle}
                </h3>
                <p className="text-muted-foreground">
                  {dictionary.contact.cvText}
                </p>
              </div>

              <a
                href="https://drive.google.com/file/d/1E-Vddik2jp6DBjU2skDewbwcqQJTvTH3/view?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95"
                onClick={() => sendGAEvent('event', 'contact_cv_download_click', { label: 'Download CV' })}
              >
                <FileDown className="w-5 h-5" />
                {dictionary.contact.cvButton}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
