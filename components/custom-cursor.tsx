"use client"


import { useEffect, useState } from "react"

function isMobile() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
}

export function CustomCursor() {

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isHidden, setIsHidden] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    setIsMobileDevice(isMobile())
  }, [])

  useEffect(() => {
    if (isMobileDevice) return

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })

      const target = e.target as HTMLElement
      setIsPointer(
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") !== null ||
        target.closest("a") !== null
      )
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    const handleMouseLeave = () => setIsHidden(true)
    const handleMouseEnter = () => setIsHidden(false)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mouseenter", handleMouseEnter)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mouseenter", handleMouseEnter)
    }
  }, [isMobileDevice])

  if (isHidden || isMobileDevice) return null

  return (
    <>
      <div
        className="fixed top-0 left-0 pointer-events-none z-9999 mix-blend-difference"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.05s ease-out",
        }}
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
            isClicking
              ? "scale-75"
              : isPointer
              ? "scale-150"
              : "scale-100"
          }`}
        >
          <div
            className={`rounded-full bg-white transition-all duration-200 ${
              isPointer ? "w-2 h-2" : "w-1.5 h-1.5"
            }`}
          />
        </div>
      </div>

      <div
        className="fixed top-0 left-0 pointer-events-none z-9998"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
            isClicking
              ? "scale-90 opacity-50"
              : isPointer
              ? "scale-150"
              : "scale-100"
          }`}
        >
          <div
            className={`rounded-full border transition-all duration-300 ${
              isPointer
                ? "w-10 h-10 border-2 border-primary/60"
                : "w-8 h-8 border border-primary/40"
            }`}
          >
            <div className="absolute inset-0 rounded-full bg-primary/10 blur-md animate-pulse"></div>
          </div>
        </div>
      </div>

      <div
        className="fixed top-0 left-0 pointer-events-none z-9997]"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div className="relative -translate-x-1/2 -translate-y-1/2">
          <div className="w-4 h-4 rounded-full bg-primary/5 blur-sm"></div>
        </div>
      </div>

      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  )
}
