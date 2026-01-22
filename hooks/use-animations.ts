import { useEffect, useRef, useState } from 'react'

export function useCountUp(end: number, duration = 2000, enabled = true) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    if (!enabled || hasStarted) return

    setHasStarted(true)
    let startTime: number | null = null
    const startValue = 0

    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * (end - startValue) + startValue))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [end, duration, enabled, hasStarted])

  return count
}

export function useInView(options = { threshold: 0.1, triggerOnce: true }) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (options.triggerOnce) {
            observer.disconnect()
          }
        } else if (!options.triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold: options.threshold }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [options.threshold, options.triggerOnce])

  return { ref, isInView }
}

export function useMagneticEffect<T extends HTMLElement = HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2

      setPosition({ x: x * strength, y: y * strength })
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    element.addEventListener('mousemove', handleMouseMove)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      element.removeEventListener('mousemove', handleMouseMove)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [strength])

  return { ref, position }
}

export function useParallax(speed = 0.5) {
  const [offset, setOffset] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const scrolled = window.scrollY
      setOffset((scrolled - rect.top) * speed)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [speed])

  return { ref, offset }
}

export const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

export const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
}

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

export const blurIn = {
  initial: { opacity: 0, filter: 'blur(10px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
}
