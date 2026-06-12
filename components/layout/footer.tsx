"use client"

import { useLocale } from "@/contexts/LocaleContext"

export function Footer() {
  const { dictionary } = useLocale()
  const currentYear = new Date().getFullYear()

  const navigationItems = [
    { label: dictionary.navigation.home, id: "hero" },
    { label: dictionary.navigation.journey, id: "journey" },
    { label: dictionary.navigation.github, id: "github" },
    { label: dictionary.navigation.projects, id: "projects" },
    { label: dictionary.navigation.articles, id: "articles" },
    { label: dictionary.navigation.stack, id: "stack" },
    { label: dictionary.navigation.contact, id: "contact" }
  ]

  return (
    <footer className="relative bg-background border-t border-white/[0.07] z-40 transition-all duration-500 pb-32 lg:pb-0 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-[oklch(0.62_0.22_41.1/0.05)] rounded-full blur-[80px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-[oklch(0.55_0.18_260/0.03)] rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-12 md:gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold font-display text-foreground tracking-tight">
              <span className="text-primary">Igor</span> Braz
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {dictionary.footer.tagline}
            </p>
          </div>

          <div className="space-y-5">
            <h4 className="font-semibold font-display text-foreground text-[11px] uppercase tracking-[0.25em]">{dictionary.footer.navigation}</h4>
            <ul className="space-y-3 text-sm">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[10px] text-primary/40 font-mono group-hover:text-primary transition-colors">▸</span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="font-semibold font-display text-foreground text-[11px] uppercase tracking-[0.25em]">{dictionary.footer.networks}</h4>
            <ul className="space-y-3 text-sm">
              {[
                { name: "GitHub", url: "https://github.com/igorbraz" },
                { name: "LinkedIn", url: "https://linkedin.com/in/igorbraz" },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-[10px] text-primary/40 font-mono group-hover:text-primary transition-colors">▸</span>
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h4 className="font-semibold font-display text-foreground text-[11px] uppercase tracking-[0.25em]">{dictionary.footer.letsTalk}</h4>
            <p className="text-sm text-muted-foreground">{dictionary.footer.ctaText}</p>
            <a
              href="#contact"
              className="w-full flex justify-center items-center px-8 py-3.5 bg-primary text-black rounded-none text-[0.925rem] font-semibold font-display hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_oklch(0.62_0.22_41.1/0.5)] transition-all duration-200"
            >
              {dictionary.footer.contactButton}
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex-1 w-full h-px bg-[linear-gradient(to_right,oklch(0.62_0.22_41.1/0.4),transparent)] hidden md:block" />
          <div className="flex items-center gap-4 text-center">
            <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest uppercase">
              {dictionary.footer.copyright.replace('{year}', String(currentYear))}
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/20 tracking-widest hidden md:inline">
              //
            </span>
            <span className="text-[10px] font-mono text-muted-foreground/40 tracking-widest uppercase hidden md:inline">
              SYS.ACTIVE
            </span>
          </div>
          <div className="flex-1 w-full h-px bg-[linear-gradient(to_left,oklch(0.62_0.22_41.1/0.4),transparent)] hidden md:block" />
        </div>
      </div>
    </footer>
  )
}
