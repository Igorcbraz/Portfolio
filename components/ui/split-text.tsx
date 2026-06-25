"use client"

import { useRef } from "react"
import { m, useInView, type Variants, type Easing } from "framer-motion"

interface SplitTextProps {
  text: string
  splitType?: "words" | "chars"
  delay?: number
  stepDelay?: number
  threshold?: number
  className?: string
  wordClassName?: string
  once?: boolean
  ease?: Easing
  duration?: number
}

export function SplitText({
  text,
  splitType = "words",
  delay = 0,
  stepDelay = 50,
  threshold = 0.15,
  className = "",
  wordClassName = "",
  once = true,
  ease = [0.16, 1, 0.3, 1],
  duration = 0.7,
}: SplitTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  if (!text || text.trim() === "") return null

  const units = splitType === "words" ? text.split(" ") : text.split("")

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stepDelay / 1000,
        delayChildren: delay / 1000,
      },
    },
  }

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 24,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration,
        ease,
      },
    },
  }

  return (
    <m.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline [perspective:1000px] ${className}`}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <m.span
          key={i}
          variants={itemVariants}
          className={`inline-block [transform-style:preserve-3d] ${wordClassName}`}
          style={
            splitType === "words"
              ? { marginRight: "0.25em" }
              : undefined
          }
        >
          {unit === " " ? "\u00A0" : unit}
        </m.span>
      ))}
    </m.span>
  )
}

export default SplitText
