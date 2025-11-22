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
    <footer className="relative bg-background border-t border-border/30">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">
              <span className="text-primary">Igor</span> Braz
            </h3>
            <p className="text-sm text-muted-foreground">
              {dictionary.footer.tagline}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-widest">{dictionary.footer.navigation}</h4>
            <ul className="space-y-2 text-sm">
                {navigationItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-widest">{dictionary.footer.networks}</h4>
            <ul className="space-y-2 text-sm">
              {[
                { name: "GitHub", url: "https://github.com/igorbraz" },
                { name: "LinkedIn", url: "https://linkedin.com/in/igorbraz" },
              ].map((social) => (
                <li key={social.name}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {social.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-foreground text-sm uppercase tracking-widest">{dictionary.footer.letsTalk}</h4>
            <p className="text-sm text-muted-foreground mb-4">{dictionary.footer.ctaText}</p>
            <a href="#contact" className="w-full block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-lg transition-all text-center">
              {dictionary.footer.contactButton}
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">{dictionary.footer.copyright.replace('{year}', String(currentYear))}</p>
        </div>
      </div>
    </footer>
  )
}
