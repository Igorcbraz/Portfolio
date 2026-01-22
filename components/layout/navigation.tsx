"use client"

import { useState, useRef, useEffect } from "react"
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { usePathname, useRouter } from "next/navigation"
import { locales } from '@/lib/locales'
import { FiGlobe } from 'react-icons/fi'
import ReactCountryFlag from 'react-country-flag'
import { Code2, Sparkles } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { dictionary, locale: currentLocale } = useLocale()
  const { isExpanded, setIsExpanded } = useVSCode()
  const [langOpen, setLangOpen] = useState(false)
  const [langOpenMobile, setLangOpenMobile] = useState(false)
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

    const isLocale = (value: string): value is (typeof locales)[number] =>
      locales.includes(value as (typeof locales)[number])

    if (isLocale(segments[1])) {
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <nav
      className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 bg-background/80 backdrop-blur border-b border-border/30`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-4">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="text-2xl font-bold text-foreground group"
            >
              <span className="text-primary">IB</span>
              <span className="group-hover:text-primary transition-colors">.</span>
            </a>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="hidden lg:flex items-center justify-center w-9 h-9 rounded-lg hover:scale-110 transition-all duration-300 group relative overflow-hidden border"
                    style={{
                      borderColor: isExpanded ? '#007acc40' : '#4ec9b040',
                    }}
                    aria-label={dictionary.navigation.ideMode}
                  >
                    <div className={`absolute inset-0 transition-all duration-300 ${isExpanded ? 'bg-[#007acc]/10' : 'bg-[#4ec9b0]/10'}`}></div>
                    <div className="relative">
                      {isExpanded ? (
                        <Code2 className="w-4 h-4 text-[#007acc] transition-transform group-hover:rotate-12 duration-300" />
                      ) : (
                        <Sparkles className="w-4 h-4 text-[#4ec9b0] transition-transform group-hover:rotate-12 duration-300" />
                      )}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{dictionary.navigation.ideMode}</p>
                  <p className="text-xs text-muted-foreground">
                    {!isExpanded ? dictionary.navigation.ideOn : dictionary.navigation.ideOff}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="hidden md:flex items-center gap-1 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
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
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-card transition-colors text-sm font-medium cursor-pointer"
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
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${l === currentLocale ? 'font-semibold' : ''}`}
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

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="hidden sm:block px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
            >
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
          <div className="md:hidden pb-4 space-y-1 border-t border-border/30">
            <div className="px-4 pt-2 pb-1">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-card transition-all duration-300 group relative overflow-hidden"
              >
                <div className={`absolute inset-0 transition-all duration-300 ${isExpanded ? 'bg-[#007acc]/10' : 'bg-[#4ec9b0]/10'}`}></div>
                <div className="relative flex items-center gap-2">
                  {isExpanded ? (
                    <Code2 className="w-4 h-4 text-[#007acc] transition-transform group-hover:rotate-12 duration-300" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-[#4ec9b0] transition-transform group-hover:rotate-12 duration-300" />
                  )}
                  <span className={`font-medium ${isExpanded ? 'text-[#007acc]' : 'text-[#4ec9b0]'}`}>
                    {dictionary.navigation.ideMode}
                  </span>
                </div>
                <div className={`relative px-2 py-0.5 rounded text-xs font-semibold ${isExpanded ? 'bg-[#007acc] text-white' : 'bg-[#4ec9b0] text-background'}`}>
                  {!isExpanded ? dictionary.navigation.ideOn : dictionary.navigation.ideOff}
                </div>
              </button>
            </div>

            <div className="px-4 pb-1">
              <button
                onClick={() => setLangOpenMobile(true)}
                className="w-full flex items-center justify-between px-4 py-2 rounded-lg hover:bg-card transition-all duration-300 group relative overflow-hidden cursor-pointer"
              >
                <div
                  className="absolute inset-0 transition-all duration-300"
                  style={{ background: `${localeMeta[currentLocale]?.color}15` }}
                ></div>
                {switching ? (
                  <div className="relative flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="font-medium">Changing language...</span>
                  </div>
                ) : (
                  <>
                    <div className="relative flex items-center gap-2">
                      <span
                        className="w-5 h-5 rounded flex items-center justify-center overflow-hidden"
                        style={{ background: `${localeMeta[currentLocale]?.color}30` }}
                      >
                        {localeMeta[currentLocale]?.countryCode ? (
                          <ReactCountryFlag
                            svg
                            countryCode={localeMeta[currentLocale]!.countryCode}
                            style={{ width: '0.9rem', height: '0.9rem' }}
                          />
                        ) : (
                          localeMeta[currentLocale]?.emoji ?? '🌐'
                        )}
                      </span>
                      <span
                        className="font-medium"
                        style={{ color: localeMeta[currentLocale]?.color }}
                      >
                        {localeMeta[currentLocale]?.name ?? currentLocale.toUpperCase()}
                      </span>
                    </div>
                    <div
                      className="relative px-2 py-0.5 rounded text-xs font-semibold text-white"
                      style={{ background: localeMeta[currentLocale]?.color }}
                    >
                      {localeMeta[currentLocale]?.code?.toUpperCase() ?? currentLocale.toUpperCase()}
                    </div>
                  </>
                )}
              </button>

              <Dialog open={langOpenMobile} onOpenChange={setLangOpenMobile}>
                <DialogContent className="sm:max-w-md" showCloseButton={true}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <FiGlobe className="w-5 h-5" />
                      Select Language
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2 pt-2">
                    {locales.map((l) => (
                      <button
                        key={l}
                        onClick={() => {
                          switchLocale(l)
                          setLangOpenMobile(false)
                        }}
                        onMouseEnter={() => setHoveredLang(l)}
                        onMouseLeave={() => setHoveredLang(null)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors cursor-pointer ${l === currentLocale ? 'font-semibold' : ''}`}
                        style={{
                          background: (hoveredLang === l || l === currentLocale) ? `${localeMeta[l]?.color}22` : undefined,
                          color: (hoveredLang === l || l === currentLocale) ? localeMeta[l]?.color : undefined,
                        }}
                      >
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm overflow-hidden"
                          style={{ background: `${localeMeta[l]?.color}22`, color: localeMeta[l]?.color }}
                        >
                          {localeMeta[l]?.countryCode ? (
                            <ReactCountryFlag svg countryCode={localeMeta[l]!.countryCode} style={{ width: '1.25rem', height: '1.25rem' }} />
                          ) : (
                            localeMeta[l]?.emoji ?? '🌐'
                          )}
                        </span>
                        <span className="flex-1 text-left">{localeMeta[l]?.name ?? l.toUpperCase()}</span>
                        {l === currentLocale && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => {
                  handleNavClick(e, item.href)
                  setIsOpen(false)
                }}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-card rounded-lg transition-colors"
              >
                {item.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={(e) => {
                handleNavClick(e, '#contact')
                setIsOpen(false)
              }}
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
