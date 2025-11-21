"use client"

import { useState } from "react"

const navItems = [
    { name: "Início", href: "#hero", id: "hero" },
    { name: "Jornada", href: "#journey", id: "journey" },
    { name: "GitHub", href: "#github", id: "github" },
    { name: "Projetos", href: "#projects", id: "projects" },
    { name: "Stack", href: "#stack", id: "stack" },
    { name: "Contato", href: "#contact", id: "contact" },
]

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur border-b border-border/30`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <a href="#hero" className="text-2xl font-bold text-foreground group">
            <span className="text-primary">IB</span>
            <span className="group-hover:text-primary transition-colors">.</span>
          </a>

          <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a href="#contact" className="hidden sm:block px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all">
              Entrar em contato
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-card transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden pb-4 space-y-2 border-t border-border/30">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-card rounded-lg transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-lg transition-all text-center"
            >
              Entrar em contato
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
