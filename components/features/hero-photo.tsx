"use client"

export function HeroPhoto() {
  return (
    <div className="relative w-[540px] h-[580px] flex items-end justify-center overflow-visible">
      <div className="absolute bottom-0 left-0 right-0 h-[480px] rounded-[20px] border border-white/8 bg-white/2 backdrop-blur-lg shadow-[0_8px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(163,230,53,0.08)] overflow-hidden" />
      <img
        src="/me.png"
        alt="Igor Braz"
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[620px] h-[660px] object-cover object-top block pointer-events-none z-10"
      />
      <div className="absolute bottom-0 left-0 right-0 h-[480px] rounded-[20px] bg-linear-to-t from-black/60 via-black/10 to-transparent pointer-events-none z-20" />
    </div>
  )
}
