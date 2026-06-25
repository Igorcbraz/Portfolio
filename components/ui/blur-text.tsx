"use client"

import { useRef, useEffect, useState } from "react"
import { m, useInView, type Variants } from "framer-motion"

interface BlurTextProps {
  text: string
  delay?: number
  animateBy?: "words" | "chars" | "lines"
  direction?: "top" | "bottom" | "left" | "right"
  threshold?: number
  className?: string
  stepDelay?: number // ms between each word/char
  once?: boolean
}

export function BlurText({
  text,
  delay = 0,
  animateBy = "words",
  direction = "top",
  threshold = 0.1,
  className = "",
  stepDelay = 60,
  once = true,
}: BlurTextProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  if (!text || text.trim() === "") return null

  const units = animateBy === "words"
    ? text.split(" ")
    : animateBy === "chars"
    ? text.split("")
    : [text]

  const fromOffset =
    direction === "top" ? { y: -18 } :
    direction === "bottom" ? { y: 18 } :
    direction === "left" ? { x: -18 } :
    { x: 18 }

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
      filter: "blur(8px)",
      ...fromOffset,
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      y: 0,
      transition: {
        duration: 0.55,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  }

  return (
    <m.span
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline ${className}`}
      aria-label={text}
    >
      {units.map((unit, i) => (
        <m.span
          key={i}
          variants={itemVariants}
          className="inline-block"
          style={animateBy === "words" ? { marginRight: "0.25em" } : undefined}
        >
          {unit === " " ? "\u00A0" : unit}
        </m.span>
      ))}
    </m.span>
  )
}

export default BlurText
