"use client"

import { useState, useRef, useEffect } from "react"
import { useLocale } from "@/contexts/LocaleContext"
import { useVSCode } from "@/contexts/VSCodeContext"
import { usePathname, useRouter } from "next/navigation"
import { locales } from '@/lib/locales'
import ReactCountryFlag from 'react-country-flag'
import { Code2, Sparkles, ChevronDown, Check } from 'lucide-react'
import { analytics } from "@/lib/analytics"

const SCROLL_THRESHOLD = 60
const NAV_H_DEFAULT = 72
const NAV_H_SCROLLED = 56
const LAYOUT_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)'
const VISUAL_EASE = 'ease'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { dictionary, locale: currentLocale } = useLocale()
  const { isExpanded, setIsExpanded, isSidebarOpen } = useVSCode()
  const [windowWidth, setWindowWidth] = useState(0)
  const [langOpen, setLangOpen] = useState(false)
  const [langOpenMobile, setLangOpenMobile] = useState(false)
  const [switching, setSwitching] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname() || '/'
  const langRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    const outside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setLangOpen(false); setIsOpen(false) }
    }
    document.addEventListener('click', outside)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('click', outside); document.removeEventListener('keydown', esc) }
  }, [])

  const switchLocale = (newLocale: string) => {
    if (newLocale === currentLocale) return
    setSwitching(true)
    analytics.trackLanguageChange(newLocale)
    const segments = pathname.split('/')
    const isLocale = (v: string): v is (typeof locales)[number] =>
      locales.includes(v as (typeof locales)[number])
    if (isLocale(segments[1])) segments[1] = newLocale
    else segments.splice(1, 0, newLocale)
    const newPath = segments.join('/') || `/${newLocale}`
    setLangOpen(false);
    (async () => { try { await router.push(newPath) } finally { setSwitching(false) } })()
  }

  const prevPathRef = useRef(pathname)
  useEffect(() => {
    if (prevPathRef.current !== pathname) { setSwitching(false); prevPathRef.current = pathname }
  }, [pathname])

  const localeMeta: Record<string, { label: string; countryCode: string }> = {
    en: { label: 'EN', countryCode: 'US' },
    pt: { label: 'PT', countryCode: 'BR' },
  }

  const navItems = [
    { name: dictionary.navigation.home, href: '#hero', id: 'hero' },
    { name: dictionary.navigation.journey, href: '#journey', id: 'journey' },
    { name: dictionary.navigation.github, href: '#github', id: 'github' },
    { name: dictionary.navigation.projects, href: '#projects', id: 'projects' },
    { name: dictionary.navigation.stack, href: '#stack', id: 'stack' },
    { name: dictionary.navigation.contact, href: '#contact', id: 'contact' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    analytics.trackClick(href, "navigation")
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)

    if (element) {
      const offset = isExpanded ? 96 : 164
      const elementPosition = element.getBoundingClientRect().top + window.scrollY
      const startPosition = window.scrollY
      const targetPosition = elementPosition - offset
      const distance = targetPosition - startPosition
      const duration = 800

      let start: number | null = null

      const step = (timestamp: number) => {
        if (!start) start = timestamp
        const progress = timestamp - start
        const percentage = Math.min(progress / duration, 1)

        const easing = percentage < 0.5
          ? 4 * percentage * percentage * percentage
          : 1 - Math.pow(-2 * percentage + 2, 3) / 2

        window.scrollTo(0, startPosition + distance * easing)

        if (progress < duration) {
          window.requestAnimationFrame(step)
        }
      }

      window.requestAnimationFrame(step)
    } else {
      const segments = pathname.split('/')
      const isLocale = (v: string): v is (typeof locales)[number] =>
        locales.includes(v as (typeof locales)[number])
      let targetPath = '/'
      if (isLocale(segments[1])) {
        targetPath = `/${segments[1]}`
      }
      router.push(`${targetPath}${href}`)
    }
    setIsOpen(false)
  }

  const navH = scrolled ? NAV_H_SCROLLED : NAV_H_DEFAULT

  const T = (props: string, duration: number, ease: string) =>
    mounted ? `${props} ${duration}ms ${ease}` : 'none'

  const navTransition = [
    T('top', 400, LAYOUT_EASE),
    T('left', 400, LAYOUT_EASE),
    T('width', 400, LAYOUT_EASE),
    T('border-radius', 400, LAYOUT_EASE),
    T('height', 400, LAYOUT_EASE),
    T('box-shadow', 300, VISUAL_EASE),
    T('border-color', 300, VISUAL_EASE),
    T('background', 300, VISUAL_EASE),
    T('transform', 400, LAYOUT_EASE),
  ].join(', ')

  let navLeft: string | number | undefined = undefined
  let navWidth: string | number | undefined = undefined
  let navTransform: string = 'translateX(-50%)'

  if (mounted) {
    if (isExpanded) {
      navLeft = '50%'
      if (scrolled) {
        navWidth = 'min(880px, calc(100vw - 32px))'
      } else {
        navWidth = '100%'
      }
    } else {
      const containerLeft = Math.max(0, (windowWidth - 1920) / 2)
      const sidebarW = windowWidth >= 768 ? (isSidebarOpen ? 288 : 48) : 0
      const editorLeft = containerLeft + sidebarW
      const editorWidth = Math.min(windowWidth, 1920) - sidebarW

      navLeft = editorLeft + editorWidth / 2

      if (scrolled) {
        navWidth = Math.min(880, editorWidth - 32)
      } else {
        navWidth = editorWidth
      }
    }
  } else {
    navLeft = '50%'
  }

  return (
    <>
      <div className="h-[72px] shrink-0" aria-hidden />

      <nav
        className={`fixed ${isExpanded ? 'z-50' : 'z-30'} overflow-visible border border-solid backdrop-blur-xl ${scrolled ? 'h-14 rounded-[14px]' : 'h-[72px] rounded-none'
          } ${isExpanded
            ? scrolled
              ? 'top-4'
              : 'top-0'
            : scrolled
              ? 'top-[108px]'
              : 'top-[92px]'
          }`}
        style={{
          background: scrolled
            ? 'oklch(0.10 0 0 / 0.45)'
            : 'oklch(0.09 0 0 / 0.35)',
          borderTopColor: 'oklch(0.95 0 0 / 0.12)',
          borderLeftColor: 'oklch(0.95 0 0 / 0.10)',
          borderRightColor: 'oklch(0.95 0 0 / 0.10)',
          borderBottomColor: 'oklch(0.95 0 0 / 0.12)',
          boxShadow: scrolled
            ? '0 8px 32px 0 oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(0.95 0 0 / 0.08)'
            : '0 4px 20px 0 oklch(0 0 0 / 0.25), inset 0 1px 0 oklch(0.95 0 0 / 0.06)',
          transition: navTransition,
          left: navLeft,
          width: navWidth,
          transform: navTransform,
        }}
      >
        <div className="hidden md:flex absolute left-1/2 top-0 bottom-0 -translate-x-1/2 items-center gap-0.5 z-1">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="group relative px-3.5 py-1.5 text-sm font-medium text-muted-foreground no-underline cursor-pointer cursor-target whitespace-nowrap transition-colors duration-200 ease-out before:content-[''] before:absolute before:inset-0 before:rounded-[6px] before:bg-transparent before:transition-colors before:duration-200 before:ease-out hover:text-foreground hover:before:bg-[oklch(0.95_0_0/0.05)] font-display"
            >
              <span className="absolute inset-0 rounded-[6px] pointer-events-none opacity-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_110%,oklch(0.62_0.22_41.1/0.22)_0%,transparent_70%)] transition-opacity duration-200 ease-out group-hover:opacity-100" />
              <span className="relative z-1">{item.name}</span>
              <span
                className="absolute bottom-[3px] left-1/2 w-[18px] h-0.5 rounded-full bg-primary -translate-x-1/2 scale-x-0 origin-center opacity-0 pointer-events-none group-hover:scale-x-100 group-hover:opacity-100"
                style={{ transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 200ms ease' }}
              />
            </a>
          ))}
        </div>

        <div
          className={`mx-auto flex items-center justify-between h-full ${scrolled ? 'max-w-full px-5' : 'max-w-7xl px-6'
            }`}
          style={{
            transition: mounted
              ? `padding 400ms ${LAYOUT_EASE}, max-width 400ms ${LAYOUT_EASE}`
              : 'none',
          }}
        >
          <div className="flex items-center gap-3 z-2">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="font-display text-xl font-bold text-foreground no-underline tracking-[-0.01em] flex items-center"
            >
              <span className="text-primary">IB</span>
              <span className="text-muted-foreground transition-colors duration-200 ease-out hover:text-primary">.</span>
            </a>

            <button
              onClick={() => {
                analytics.trackIDEInteraction(!isExpanded ? "open" : "close", "Navigation");
                setIsExpanded(!isExpanded);
              }}
              className={`hidden lg:flex items-center justify-center w-8 h-8 group relative overflow-hidden rounded-lg border border-solid transition-all duration-200 ease-out cursor-pointer cursor-target ${isExpanded
                ? 'border-[oklch(0.55_0.18_220/0.30)] bg-[oklch(0.55_0.18_220/0.08)]'
                : 'border-[oklch(0.75_0.12_180/0.30)] bg-[oklch(0.75_0.12_180/0.08)]'
                }`}
              aria-label={dictionary.navigation.ideMode}
              title={`${dictionary.navigation.ideMode} — ${!isExpanded ? dictionary.navigation.ideOn : dictionary.navigation.ideOff}`}
            >
              {isExpanded
                ? <Code2 className="w-3.5 h-3.5 transition-transform group-hover:rotate-12 duration-200 text-[oklch(0.55_0.18_220)]" />
                : <Sparkles className="w-3.5 h-3.5 transition-transform group-hover:rotate-12 duration-200 text-[oklch(0.75_0.12_180)]" />
              }
            </button>
          </div>

          <div className="flex items-center gap-3 z-2">
            <div className={`relative ${!scrolled ? 'hidden sm:block' : 'hidden'}`} ref={langRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Select language"
                aria-expanded={langOpen}
                className={`flex items-center gap-1.5 font-display text-[0.8rem] font-medium tracking-[0.06em] px-2.5 py-[5px] rounded-[6px] border border-solid transition-all duration-200 ease-out cursor-pointer cursor-target ${langOpen
                  ? 'text-foreground border-[oklch(0.95_0_0/0.16)] bg-[oklch(0.95_0_0/0.04)]'
                  : 'text-muted-foreground border-[oklch(0.95_0_0/0.08)] bg-transparent hover:text-foreground hover:border-[oklch(0.95_0_0/0.16)] hover:bg-[oklch(0.95_0_0/0.04)]'
                  }`}
              >
                {switching ? (
                  <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                ) : (
                  <>
                    <ReactCountryFlag
                      svg
                      countryCode={localeMeta[currentLocale]?.countryCode ?? 'US'}
                      style={{ width: '1rem', height: '1rem', borderRadius: 2, flexShrink: 0 }}
                    />
                    <span>{localeMeta[currentLocale]?.label ?? currentLocale.toUpperCase()}</span>
                    <ChevronDown
                      className={`w-3 h-3 opacity-50 shrink-0 transition-transform duration-200 ease-out ${langOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    />
                  </>
                )}
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 z-60 top-[calc(100%+8px)] min-w-40 bg-[oklch(0.11_0_0/0.92)] backdrop-blur-lg border border-solid border-[oklch(0.95_0_0/0.08)] rounded-[10px] shadow-[0_16px_48px_-8px_oklch(0_0_0/0.55)] p-1.5 origin-top-right animate-lang-drop"
                >
                  {locales.map((l) => {
                    const active = l === currentLocale
                    return (
                      <button
                        key={l}
                        onClick={() => switchLocale(l)}
                        className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] border-none font-display text-[0.8rem] tracking-[0.02em] transition-all duration-150 ease-out cursor-pointer cursor-target ${active
                          ? 'bg-[oklch(0.95_0_0/0.06)] font-semibold text-foreground'
                          : 'bg-transparent font-normal text-muted-foreground hover:bg-[oklch(0.95_0_0/0.04)] hover:text-foreground'
                          }`}
                      >
                        <ReactCountryFlag
                          svg
                          countryCode={localeMeta[l]?.countryCode ?? 'US'}
                          style={{ width: '1rem', height: '1rem', borderRadius: 2, flexShrink: 0 }}
                        />
                        <span className="flex-1 text-left">
                          {l === 'en' ? 'English' : 'Português'}
                        </span>
                        {active && <Check className="w-3 h-3 shrink-0 text-primary" />}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className={`hidden sm:block font-display font-semibold text-[0.85rem] tracking-[0.01em] text-black bg-primary rounded-none no-underline shrink-0 hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_oklch(0.62_0.22_41.1/0.5)] ${scrolled ? 'px-[18px] py-[7px]' : 'px-[22px] py-[9px]'
                }`}
              style={{
                transition: mounted
                  ? `transform 200ms ease, box-shadow 200ms ease, padding 400ms ${LAYOUT_EASE}`
                  : 'none',
              }}
            >
              {dictionary.navigation.contactButton}
            </a>

            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              className="md:hidden p-1.5 rounded-[6px] border border-solid border-[oklch(0.95_0_0/0.08)] bg-transparent text-muted-foreground transition-colors duration-200 ease-out cursor-pointer cursor-target hover:border-[oklch(0.95_0_0/0.18)] hover:text-foreground"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                }
              </svg>
            </button>
          </div>
        </div>

        {isOpen && (
          <div
            id="mobile-navigation"
            className={`absolute left-0 right-0 backdrop-blur-xl border-t border-solid p-[12px_16px_16px] ${scrolled ? 'top-14 rounded-b-[14px]' : 'top-[72px] rounded-none'
              }`}
            style={{
              background: 'oklch(0.10 0 0 / 0.65)',
              borderTopColor: 'oklch(0.95 0 0 / 0.08)',
              borderBottomColor: 'oklch(0.95 0 0 / 0.08)',
              boxShadow: '0 8px 32px 0 oklch(0 0 0 / 0.5)',
            }}
          >
            <button
              onClick={() => {
                analytics.trackIDEInteraction(!isExpanded ? "open" : "close", "MobileNavigation");
                setIsExpanded(!isExpanded);
              }}
              className={`w-full flex items-center justify-between group mb-1.5 px-3 py-2 rounded-[6px] border border-solid transition-all duration-200 ease-out cursor-pointer cursor-target ${isExpanded
                ? 'bg-[oklch(0.55_0.18_220/0.08)] border-[oklch(0.55_0.18_220/0.20)]'
                : 'bg-[oklch(0.75_0.12_180/0.08)] border-[oklch(0.75_0.12_180/0.20)]'
                }`}
            >
              <div className="flex items-center gap-2">
                {isExpanded
                  ? <Code2 className="w-3.5 h-3.5 text-[oklch(0.55_0.18_220)]" />
                  : <Sparkles className="w-3.5 h-3.5 text-[oklch(0.75_0.12_180)]" />
                }
                <span className={`font-display text-[0.8rem] font-medium ${isExpanded ? 'text-[oklch(0.55_0.18_220)]' : 'text-[oklch(0.75_0.12_180)]'
                  }`}>
                  {dictionary.navigation.ideMode}
                </span>
              </div>
              <span className={`font-display text-[0.7rem] font-bold tracking-[0.06em] uppercase ${isExpanded ? 'text-[oklch(0.55_0.18_220)]' : 'text-[oklch(0.75_0.12_180)]'
                }`}>
                {!isExpanded ? dictionary.navigation.ideOn : dictionary.navigation.ideOff}
              </span>
            </button>

            <button
              onClick={() => setLangOpenMobile((p) => !p)}
              aria-expanded={langOpenMobile}
              className="w-full flex items-center justify-between cursor-pointer cursor-target mb-1 px-3 py-2 rounded-[6px] border border-solid border-[oklch(0.95_0_0/0.08)] bg-transparent transition-colors duration-200 ease-out hover:bg-[oklch(0.95_0_0/0.04)]"
            >
              <div className="flex items-center gap-2">
                <ReactCountryFlag
                  svg
                  countryCode={localeMeta[currentLocale]?.countryCode ?? 'US'}
                  style={{ width: '1rem', height: '1rem', borderRadius: 2 }}
                />
                <span className="font-display text-[0.8rem] font-medium text-foreground">
                  {currentLocale === 'en' ? 'English' : 'Português'}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 opacity-50 transition-transform duration-200 ease-out ${langOpenMobile ? 'rotate-180' : 'rotate-0'
                  }`}
              />
            </button>

            {langOpenMobile && (
              <div className="mb-1 rounded-lg border border-solid border-[oklch(0.95_0_0/0.08)] bg-[oklch(0.11_0_0/0.9)] p-1">
                {locales.map((l) => {
                  const active = l === currentLocale
                  return (
                    <button
                      key={l}
                      onClick={() => { switchLocale(l); setLangOpenMobile(false) }}
                      className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-[6px] border-none font-display text-[0.8rem] transition-colors duration-150 ease-out cursor-pointer cursor-target ${active
                        ? 'bg-[oklch(0.95_0_0/0.06)] font-semibold text-foreground'
                        : 'bg-transparent font-normal text-muted-foreground hover:bg-[oklch(0.95_0_0/0.04)] hover:text-foreground'
                        }`}
                    >
                      <ReactCountryFlag
                        svg
                        countryCode={localeMeta[l]?.countryCode ?? 'US'}
                        style={{ width: '1rem', height: '1rem', borderRadius: 2 }}
                      />
                      <span className="flex-1 text-left">
                        {l === 'en' ? 'English' : 'Português'}
                      </span>
                      {active && <Check className="w-3 h-3 text-primary" />}
                    </button>
                  )
                })}
              </div>
            )}

            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="block px-3 py-2 font-display text-sm font-medium text-muted-foreground no-underline rounded-[6px] transition-colors duration-200 ease-out hover:text-foreground hover:bg-[oklch(0.95_0_0/0.04)]"
              >
                {item.name}
              </a>
            ))}

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="block mt-2 px-5 py-[11px] font-display font-semibold text-sm tracking-[0.01em] text-black bg-primary rounded-none text-center no-underline"
            >
              {dictionary.navigation.contactButton}
            </a>
          </div>
        )}
      </nav>
    </>
  )
}
