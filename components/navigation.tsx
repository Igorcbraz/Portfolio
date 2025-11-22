"use client"

import { useState, useRef, useEffect } from "react"
import { useLocale } from "@/contexts/LocaleContext"
import { usePathname, useRouter } from "next/navigation"
import { locales } from '@/proxy'
import { FiGlobe } from 'react-icons/fi'
import ReactCountryFlag from 'react-country-flag'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { dictionary, locale: currentLocale } = useLocale()
  const [langOpen, setLangOpen] = useState(false)
  const [hoveredLang, setHoveredLang] = useState<string | null>(null)
  const [switching, setSwitching] = useState(false)
  const router = useRouter()
  const pathname = usePathname() || '/'
  const langRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setLangOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [])

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return
    setSwitching(true)
    const segments = pathname.split('/')

    if (locales.includes(segments[1])) {
      segments[1] = newLocale
    } else {
      segments.splice(1, 0, newLocale)
    }
    const newPath = segments.join('/') || ('/' + newLocale)
    setLangOpen(false);
    (async () => {
      try {
        await router.push(newPath)
      } finally {
        setSwitching(false)
      }
    })()
  }

  const prevPathRef = useRef(pathname)
  useEffect(() => {
    if (prevPathRef.current !== pathname) {
      setSwitching(false)
      prevPathRef.current = pathname
    }
  }, [pathname])

  const localeMeta: Record<string, { name: string; color: string; emoji?: string; countryCode?: string; code?: string }> = {
    en: { name: 'English', color: '#1E40AF', emoji: '🇺🇸', countryCode: 'US', code: 'en-us' },
    pt: { name: 'Português', color: '#009c3b', emoji: '🇧🇷', countryCode: 'BR', code: 'pt-br' },
  }

  const navItems = [
    { name: dictionary.navigation.home, href: "#hero", id: "hero" },
    { name: dictionary.navigation.journey, href: "#journey", id: "journey" },
    { name: dictionary.navigation.github, href: "#github", id: "github" },
    { name: dictionary.navigation.projects, href: "#projects", id: "projects" },
    { name: dictionary.navigation.stack, href: "#stack", id: "stack" },
    { name: dictionary.navigation.contact, href: "#contact", id: "contact" },
  ]

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
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Select language"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card transition-colors text-sm font-medium"
              >
                {switching ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <>
                    <FiGlobe className="w-5 h-5" />
                    <span className="text-sm">{localeMeta[currentLocale]?.code ?? currentLocale}</span>
                  </>
                )}
              </button>

              {langOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-card border border-border/20 rounded-lg shadow-lg z-50">
                  <div className="p-2">
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => switchLocale(l)}
                        onMouseEnter={() => setHoveredLang(l)}
                        onMouseLeave={() => setHoveredLang(null)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${l === currentLocale ? 'font-semibold' : ''}`}
                        style={{
                          background: (hoveredLang === l || l === currentLocale) ? `${localeMeta[l]?.color}22` : undefined,
                          color: (hoveredLang === l || l === currentLocale) ? localeMeta[l]?.color : undefined,
                        }}
                      >
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-sm overflow-hidden"
                          style={{ background: `${localeMeta[l]?.color}22`, color: localeMeta[l]?.color }}
                        >
                          {localeMeta[l]?.countryCode ? (
                            <ReactCountryFlag svg countryCode={localeMeta[l]!.countryCode} style={{ width: '1.1rem', height: '1.1rem' }} />
                          ) : (
                            localeMeta[l]?.emoji ?? '🌐'
                          )}
                        </span>
                        <span className="flex-1">{localeMeta[l]?.name ?? l.toUpperCase()}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="#contact" className="hidden sm:block px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all">
              {dictionary.navigation.contactButton}
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
            <div className="px-4 py-2">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-card transition-colors"
              >
                <span className="font-medium">Language</span>
                <span className="uppercase">{localeMeta[currentLocale]?.emoji ?? currentLocale.toUpperCase()}</span>
              </button>

              {langOpen && (
                <div className="mt-2 space-y-1">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => switchLocale(l)}
                      onMouseEnter={() => setHoveredLang(l)}
                      onMouseLeave={() => setHoveredLang(null)}
                      className={`w-full flex items-center gap-3 px-4 py-2 rounded-md text-sm ${l === currentLocale ? 'font-semibold' : ''}`}
                      style={{
                        background: (hoveredLang === l || l === currentLocale) ? `${localeMeta[l]?.color}22` : undefined,
                        color: (hoveredLang === l || l === currentLocale) ? localeMeta[l]?.color : undefined,
                      }}
                    >
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-sm overflow-hidden" style={{ background: `${localeMeta[l]?.color}22`, color: localeMeta[l]?.color }}>
                        {localeMeta[l]?.countryCode ? (
                          <ReactCountryFlag svg countryCode={localeMeta[l]!.countryCode} style={{ width: '1.1rem', height: '1.1rem' }} />
                        ) : (
                          localeMeta[l]?.emoji ?? '🌐'
                        )}
                      </span>
                      <span className="flex-1">{localeMeta[l]?.name ?? l.toUpperCase()}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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
              {dictionary.navigation.contactButton}
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
