"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { useInView } from "framer-motion"

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\.:_-|#"

interface DecryptedTextProps {
  text: string
  speed?: number // ms per frame
  delay?: number // ms before starting
  className?: string
  once?: boolean
  revealOnHover?: boolean
  threshold?: number
}

export function DecryptedText({
  text,
  speed = 40,
  delay = 0,
  className = "",
  once = true,
  revealOnHover = false,
  threshold = 0.2,
}: DecryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const [displayed, setDisplayed] = useState(text.replace(/./g, " "))
  const [done, setDone] = useState(false)
  const [hovered, setHovered] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const iterRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startDecrypt = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    iterRef.current = 0
    setDone(false)

    intervalRef.current = setInterval(() => {
      const iter = iterRef.current
      setDisplayed(
        text
          .split("")
          .map((char, idx) => {
            if (char === " ") return " "
            if (idx < iter) return char
            return CHARS[Math.floor(Math.random() * CHARS.length)]
          })
          .join("")
      )

      iterRef.current += 0.5
      if (iterRef.current >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current)
        setDisplayed(text)
        setDone(true)
      }
    }, speed)
  }, [text, speed])

  useEffect(() => {
    if (!isInView || revealOnHover) return
    timeoutRef.current = setTimeout(startDecrypt, delay)
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isInView, revealOnHover, delay, startDecrypt])

  useEffect(() => {
    if (!revealOnHover) return
    if (hovered) {
      startDecrypt()
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (!done) setDisplayed(text.replace(/\S/g, " "))
    }
  }, [hovered, revealOnHover, done, startDecrypt, text])

  return (
    <span
      ref={ref}
      className={`font-mono ${className}`}
      onMouseEnter={() => revealOnHover && setHovered(true)}
      onMouseLeave={() => revealOnHover && setHovered(false)}
      aria-label={text}
    >
      {displayed}
    </span>
  )
}

export default DecryptedText
