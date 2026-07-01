"use client"

import Image from "next/image"

interface Logo {
  src: string
  alt: string
  width?: number
  height?: number
}

interface LogoLoopProps {
  logos: Logo[]
  speed?: number
  className?: string
}


export function LogoLoop({
  logos,
  speed = 55,
  className = "",
}: LogoLoopProps) {
  const repeats = 4
  const allLogos = Array.from({ length: repeats }, () => logos).flat()

  const duration = (logos.length * repeats * 160) / speed

  return (
    <>
      <style>{`
        @keyframes logo-marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .logo-loop-track {
          animation: logo-marquee ${duration}s linear infinite;
          will-change: transform;
        }
        .logo-loop-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className={`relative overflow-hidden ${className}`}>
        <div
          className="absolute left-0 top-0 h-full w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, var(--background) 0%, transparent 100%)" }}
        />
        <div
          className="absolute right-0 top-0 h-full w-28 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, var(--background) 0%, transparent 100%)" }}
        />
        <div className="logo-loop-track flex items-center" style={{ width: "max-content" }}>
          {allLogos.map((logo, i) => (
            <LogoItem key={i} logo={logo} />
          ))}
        </div>
      </div>
    </>
  )
}

function LogoItem({ logo }: { logo: Logo }) {
  return (
    <div className="group mx-10 shrink-0 flex items-center justify-center select-none cursor-default">
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width ?? 120}
        height={logo.height ?? 44}
        className={[
          "object-contain",
          "shrink-0",
          // Always grayscale + low opacity by default
          "grayscale opacity-40",
          // On hover: full color + full opacity
          "group-hover:grayscale-0 group-hover:opacity-90",
          "transition-all duration-400",
          // Blend mode so white-background logos don't show a white box on dark bg
          "mix-blend-luminosity",
          "group-hover:mix-blend-normal",
        ].join(" ")}
        draggable={false}
      />
    </div>
  )
}
