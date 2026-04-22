"use client"

import { useEffect, useRef, useState, type ComponentType } from "react"
import dynamic from "next/dynamic"
import { Hero } from "@/components/sections/hero"

const ScrollProgress = dynamic(() => import("@/components/features/scroll-progress").then((m) => m.ScrollProgress), {
  ssr: false,
  loading: () => null,
})

type SectionComponent = ComponentType<Record<string, never>>
type SectionLoader = () => Promise<SectionComponent>

const loadProfessionalJourney: SectionLoader = () =>
  import("@/components/sections/professional-journey").then((m) => m.ProfessionalJourney)

const loadCodeDashboard: SectionLoader = () =>
  import("@/components/features/code-dashboard").then((m) => m.CodeDashboard)

const loadProjects: SectionLoader = () =>
  import("@/components/sections/projects").then((m) => m.Projects)

const loadArticles: SectionLoader = () =>
  import("@/components/sections/articles").then((m) => m.Articles)

const loadTechStack: SectionLoader = () =>
  import("@/components/sections/tech-stack").then((m) => m.TechStack)

const loadContactSection: SectionLoader = () =>
  import("@/components/sections/contact-section").then((m) => m.ContactSection)

const loadFooter: SectionLoader = () =>
  import("@/components/layout/footer").then((m) => m.Footer)

function DeferredSection({
  loader,
  rootMargin = "0px 0px",
  minHeight = 1,
}: {
  loader: SectionLoader
  rootMargin?: string
  minHeight?: number
}) {
  const [LoadedComponent, setLoadedComponent] = useState<SectionComponent | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (LoadedComponent) return

    const element = triggerRef.current
    if (!element) return
    let isCancelled = false

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loader().then((Component) => {
            if (!isCancelled) {
              setLoadedComponent(() => Component)
            }
          })
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(element)
    return () => {
      isCancelled = true
      observer.disconnect()
    }
  }, [LoadedComponent, loader, rootMargin])

  return (
    <div ref={triggerRef} style={LoadedComponent ? undefined : { minHeight }}>
      {LoadedComponent ? <LoadedComponent /> : null}
    </div>
  )
}

export function PortfolioContent() {
  const [shouldMountScrollProgress, setShouldMountScrollProgress] = useState(false)

  useEffect(() => {
    if (window.scrollY > 0) {
      setShouldMountScrollProgress(true)
      return
    }

    const enableScrollProgress = () => setShouldMountScrollProgress(true)
    const interactionEvents: Array<keyof WindowEventMap> = ["wheel", "touchstart", "pointerdown", "keydown", "scroll"]

    interactionEvents.forEach((eventName) => {
      window.addEventListener(eventName, enableScrollProgress, { once: true, passive: true })
    })

    return () => {
      interactionEvents.forEach((eventName) => {
        window.removeEventListener(eventName, enableScrollProgress)
      })
    }
  }, [])

  return (
    <>
      {shouldMountScrollProgress ? <ScrollProgress /> : null}
      <div className="relative z-10 bg-black">
        <main className="w-full pb-8 mb-8">
          <section id="hero">
            <Hero />
          </section>
          <section id="journey">
            <DeferredSection loader={loadProfessionalJourney} minHeight={400} />
          </section>
          <section id="github">
            <DeferredSection loader={loadCodeDashboard} minHeight={600} />
          </section>
          <section id="projects">
            <DeferredSection loader={loadProjects} minHeight={500} />
          </section>
          <section id="articles">
            <DeferredSection loader={loadArticles} minHeight={500} />
          </section>
          <section id="stack">
            <DeferredSection loader={loadTechStack} minHeight={500} />
          </section>
          <div>
            <DeferredSection loader={loadContactSection} minHeight={360} />
          </div>
        </main>
        <DeferredSection loader={loadFooter} minHeight={260} />
      </div>
    </>
  )
}
