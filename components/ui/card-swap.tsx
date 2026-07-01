"use client"

import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useEffect,
  useMemo,
  useRef
} from 'react'
import gsap from 'gsap'

export interface CardSwapProps {
  width?: number | string
  height?: number | string
  cardDistance?: number
  verticalDistance?: number
  delay?: number
  pauseOnHover?: boolean
  onCardClick?: (idx: number) => void
  skewAmount?: number
  easing?: 'linear' | 'elastic'
  children: ReactNode
  activeIndex?: number
  onChange?: (idx: number) => void
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute top-1/2 left-1/2 rounded-xl border-none bg-transparent transform-3d will-change-transform backface-hidden ${customClass ?? ''} ${rest.className ?? ''}`.trim()}
  />
))
Card.displayName = 'Card'

type CardRef = RefObject<HTMLDivElement | null>
interface Slot {
  x: number
  y: number
  z: number
  zIndex: number
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
})

const placeNow = (el: HTMLElement, slot: Slot, skew: number) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  })

export const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 35,
  verticalDistance = 30,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 2,
  easing = 'elastic',
  children,
  activeIndex,
  onChange
}) => {
  const config =
    easing === 'elastic'
      ? {
        ease: 'elastic.out(0.6,0.9)',
        durDrop: 1.5,
        durMove: 1.5,
        durReturn: 1.5,
        promoteOverlap: 0.9,
        returnDelay: 0.05
      }
      : {
        ease: 'power1.inOut',
        durDrop: 0.8,
        durMove: 0.8,
        durReturn: 0.8,
        promoteOverlap: 0.45,
        returnDelay: 0.2
      }

  const childArr = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children])
  const refs = useMemo<CardRef[]>(() => childArr.map(() => React.createRef<HTMLDivElement>()), [childArr.length])

  const order = useRef<number[]>(Array.from({ length: childArr.length }, (_, i) => i))

  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const intervalRef = useRef<number>(0)
  const container = useRef<HTMLDivElement>(null)

  const swap = () => {
    if (order.current.length < 2) return

    const [front, ...rest] = order.current
    const elFront = refs[front].current!

    gsap.set(elFront, { pointerEvents: 'none' })

    const tl = gsap.timeline()
    tlRef.current = tl

    tl.to(elFront, {
      y: '+=500',
      duration: config.durDrop,
      ease: config.ease
    })

    tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`)
    rest.forEach((idx, i) => {
      const el = refs[idx].current!
      const slot = makeSlot(i, cardDistance, verticalDistance, refs.length)
      tl.set(el, { zIndex: slot.zIndex }, 'promote')
      tl.to(
        el,
        {
          x: slot.x,
          y: slot.y,
          z: slot.z,
          duration: config.durMove,
          ease: config.ease
        },
        `promote+=${i * 0.15}`
      )
    })

    const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length)
    tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`)
    tl.call(
      () => {
        gsap.set(elFront, { zIndex: backSlot.zIndex })
      },
      undefined,
      'return'
    )
    tl.to(
      elFront,
      {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: config.durReturn,
        ease: config.ease
      },
      'return'
    )

    tl.call(() => {
      gsap.set(elFront, { pointerEvents: 'auto' })

      const nextOrder = [...rest, front]
      order.current = nextOrder
      if (onChange) {
        onChange(nextOrder[0])
      }
    })
  }

  const swapRef = useRef(swap)
  useEffect(() => {
    swapRef.current = swap
  }, [swap])

  const startInterval = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
    intervalRef.current = window.setInterval(() => {
      swapRef.current()
    }, delay)
  }

  const stopInterval = () => {
    if (intervalRef.current) window.clearInterval(intervalRef.current)
  }

  useEffect(() => {
    const total = refs.length
    if (total === 0) return

    refs.forEach((r, i) => {
      if (r.current) {
        placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount)
      }
    })

    startInterval()

    if (pauseOnHover && container.current) {
      const node = container.current
      const pause = () => {
        tlRef.current?.pause()
        stopInterval()
      }
      const resume = () => {
        tlRef.current?.play()
        startInterval()
      }
      node.addEventListener('mouseenter', pause)
      node.addEventListener('mouseleave', resume)
      return () => {
        node.removeEventListener('mouseenter', pause)
        node.removeEventListener('mouseleave', resume)
        stopInterval()
      }
    }
    return () => stopInterval()
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs])

  useEffect(() => {
    if (activeIndex === undefined || refs.length === 0) return

    if (order.current[0] !== activeIndex) {
      const pos = order.current.indexOf(activeIndex)
      if (pos !== -1) {
        const newOrder = [...order.current.slice(pos), ...order.current.slice(0, pos)]
        order.current = newOrder

        refs.forEach((r, i) => {
          if (r.current) {
            const slotIndex = order.current.indexOf(i)
            const slot = makeSlot(slotIndex, cardDistance, verticalDistance, refs.length)
            gsap.to(r.current, {
              x: slot.x,
              y: slot.y,
              z: slot.z,
              zIndex: slot.zIndex,
              duration: 0.8,
              ease: config.ease
            })
          }
        })

        startInterval()
      }
    }
  }, [activeIndex, cardDistance, verticalDistance, refs, config.ease])

  const rendered = childArr.map((child, i) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
        key: i,
        ref: refs[i],
        style: { width, height, ...(child.props.style ?? {}) },
        onClick: e => {
          child.props.onClick?.(e as React.MouseEvent<HTMLDivElement>)
          onCardClick?.(i)
        }
      } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child
  )

  return (
    <div
      ref={container}
      className="relative mx-auto perspective-[900px] overflow-visible max-[768px]:scale-[0.85] max-[480px]:scale-[0.65]"
      style={{ width, height }}
    >
      {rendered}
    </div>
  )
}

export default CardSwap
