"use client"

import { useEffect, useState } from "react"
import { useVSCode } from "@/contexts/VSCodeContext"
import { accentColors, cursorPresets } from "@/lib/cursor-styles"

function isMobile() {
  if (typeof window === "undefined") return false
  return window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
}

export function CustomCursor() {
  const { cursorConfig } = useVSCode()
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

  const colorConfig = accentColors[cursorConfig.color] || accentColors.blue
  const presetConfig = cursorPresets[cursorConfig.preset] || cursorPresets.default
  const scale = presetConfig.size

  const renderCursorStyle = () => {
    switch (presetConfig.renderStyle) {
      case "minimal":
        return (
          <div
            className="fixed top-0 left-0 pointer-events-none z-9999"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: "transform 0.05s ease-out",
            }}
          >
            <div
              className={`relative -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isClicking ? "scale-75" : isPointer ? "scale-150" : "scale-100"
                }`}
              style={{ transform: `scale(${scale})` }}
            >
              <div
                className="rounded-full transition-all duration-200"
                style={{
                  width: isPointer ? "8px" : "6px",
                  height: isPointer ? "8px" : "6px",
                  backgroundColor: colorConfig.primary,
                }}
              />
            </div>
          </div>
        )

      case "crosshair":
        return (
          <div
            className="fixed top-0 left-0 pointer-events-none z-9999"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: "transform 0.05s ease-out",
            }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2">
              <div
                className="absolute rounded-full"
                style={{
                  width: "4px",
                  height: "4px",
                  backgroundColor: colorConfig.primary,
                  left: "-2px",
                  top: "-2px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "20px",
                  height: "2px",
                  backgroundColor: colorConfig.primary,
                  left: "-10px",
                  top: "-1px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "2px",
                  height: "20px",
                  backgroundColor: colorConfig.primary,
                  left: "-1px",
                  top: "-10px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "2px",
                  backgroundColor: colorConfig.secondary,
                  left: "-20px",
                  top: "-20px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "2px",
                  height: "8px",
                  backgroundColor: colorConfig.secondary,
                  left: "-20px",
                  top: "-20px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "2px",
                  backgroundColor: colorConfig.secondary,
                  right: "-20px",
                  top: "-20px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "2px",
                  height: "8px",
                  backgroundColor: colorConfig.secondary,
                  right: "-20px",
                  top: "-20px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "2px",
                  backgroundColor: colorConfig.secondary,
                  left: "-20px",
                  bottom: "-20px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "2px",
                  height: "8px",
                  backgroundColor: colorConfig.secondary,
                  left: "-20px",
                  bottom: "-20px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "8px",
                  height: "2px",
                  backgroundColor: colorConfig.secondary,
                  right: "-20px",
                  bottom: "-20px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  width: "2px",
                  height: "8px",
                  backgroundColor: colorConfig.secondary,
                  right: "-20px",
                  bottom: "-20px",
                }}
              />
            </div>
          </div>
        )

      case "spotlight":
        return (
          <>
            <div
              className="fixed top-0 left-0 pointer-events-none z-9999"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: "transform 0.1s ease-out",
              }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div
                  className="rounded-full"
                  style={{
                    width: "120px",
                    height: "120px",
                    background: `radial-gradient(circle, ${colorConfig.glow}, transparent 70%)`,
                    opacity: 0.6,
                  }}
                />
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: colorConfig.primary,
                    boxShadow: `0 0 10px ${colorConfig.glow}`,
                  }}
                />
              </div>
            </div>
          </>
        )

      case "ripple":
        return (
          <>
            <div
              className="fixed top-0 left-0 pointer-events-none z-9999"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: "transform 0.05s ease-out",
              }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div
                  className="rounded-full"
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: colorConfig.primary,
                  }}
                />
              </div>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="fixed top-0 left-0 pointer-events-none z-9998"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  transition: `transform ${0.1 + i * 0.05}s ease-out`,
                }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="rounded-full border animate-pulse"
                    style={{
                      width: `${20 + i * 15}px`,
                      height: `${20 + i * 15}px`,
                      borderColor: colorConfig.primary,
                      borderWidth: "2px",
                      opacity: 0.6 - i * 0.15,
                      animation: `pulse ${1 + i * 0.3}s ease-in-out infinite`,
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        )

      case "vortex":
        return (
          <div
            className="fixed top-0 left-0 pointer-events-none z-9999"
            style={{
              transform: `translate(${position.x}px, ${position.y}px)`,
              transition: "transform 0.08s ease-out",
            }}
          >
            <div className="relative -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: "3s" }}>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${6 + i * 4}px`,
                    height: `${6 + i * 4}px`,
                    left: `${Math.cos((i * Math.PI) / 3) * (10 + i * 3)}px`,
                    top: `${Math.sin((i * Math.PI) / 3) * (10 + i * 3)}px`,
                    backgroundColor: colorConfig.primary,
                    opacity: 0.8 - i * 0.1,
                    filter: `blur(${i}px)`,
                  }}
                />
              ))}
              <div
                className="absolute rounded-full"
                style={{
                  width: "8px",
                  height: "8px",
                  left: "-4px",
                  top: "-4px",
                  backgroundColor: colorConfig.primary,
                  boxShadow: `0 0 15px ${colorConfig.glow}`,
                }}
              />
            </div>
          </div>
        )

      case "trail":
        return (
          <>
            <div
              className="fixed top-0 left-0 pointer-events-none z-9999"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`,
                transition: "transform 0.05s ease-out",
              }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                <div
                  className="rounded-full"
                  style={{
                    width: "6px",
                    height: "6px",
                    backgroundColor: colorConfig.primary,
                    boxShadow: `0 0 10px ${colorConfig.glow}`,
                  }}
                />
              </div>
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="fixed top-0 left-0 pointer-events-none z-9998"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  transition: `transform ${0.1 + i * 0.08}s ease-out`,
                }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="rounded-full"
                    style={{
                      width: `${6 - i * 0.8}px`,
                      height: `${6 - i * 0.8}px`,
                      backgroundColor: colorConfig.primary,
                      opacity: 0.8 - i * 0.15,
                      filter: `blur(${i * 0.5}px)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </>
        )

      default:
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
                className={`relative -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${isClicking ? "scale-75" : isPointer ? "scale-150" : "scale-100"
                  }`}
                style={{ transform: `scale(${scale})` }}
              >
                <div
                  className="rounded-full bg-white transition-all duration-200"
                  style={{
                    width: isPointer ? "8px" : "6px",
                    height: isPointer ? "8px" : "6px",
                  }}
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
                className={`relative -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isClicking ? "scale-90 opacity-50" : isPointer ? "scale-150" : "scale-100"
                  }`}
                style={{ transform: `scale(${scale})` }}
              >
                <div
                  className={`rounded-full border transition-all duration-300 ${presetConfig.useOriginalColor ? 'border-primary/40' : ''
                    }`}
                  style={{
                    width: isPointer ? "40px" : "32px",
                    height: isPointer ? "40px" : "32px",
                    borderWidth: "2px",
                    borderColor: presetConfig.useOriginalColor ? undefined : `${colorConfig.primary}99`,
                  }}
                >
                  {presetConfig.blur && (
                    <div
                      className={`absolute inset-0 rounded-full animate-pulse ${presetConfig.useOriginalColor ? 'bg-primary/10' : ''
                        }`}
                      style={{
                        backgroundColor: presetConfig.useOriginalColor ? undefined : `${colorConfig.primary}1A`,
                        filter: "blur(8px)",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
            {presetConfig.trail && (
              <div
                className="fixed top-0 left-0 pointer-events-none z-9997"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px)`,
                  transition: "transform 0.3s ease-out",
                }}
              >
                <div className="relative -translate-x-1/2 -translate-y-1/2">
                  <div
                    className={`rounded-full ${presetConfig.useOriginalColor ? 'bg-primary/5' : ''}`}
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: presetConfig.useOriginalColor ? undefined : `${colorConfig.primary}0D`,
                      filter: "blur(4px)",
                    }}
                  />
                </div>
              </div>
            )}
          </>
        )
    }
  }

  return (
    <>
      {renderCursorStyle()}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
      `}</style>
    </>
  )
}
