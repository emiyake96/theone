'use client'

import { useEffect, useRef } from 'react'

// Colors of the snake from head to tail
const COLORS = ['#ff2d9b', '#00eeff', '#8899aa']
const N = COLORS.length

// Raw path data from the Lucide Sparkles icon (24x24 viewBox)
const PATHS = [
  'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
  'M20 3v4',
  'M22 5h-4',
  'M4 17v2',
  'M5 18H3',
]

interface Props {
  className?: string
  active: boolean
}

export function SparklesSnake({ className, active }: Props) {
  const svgRef = useRef<SVGSVGElement>(null)
  const rafRef = useRef<number | undefined>(undefined)
  const t0Ref = useRef<number | undefined>(undefined)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    if (!active) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = undefined
      t0Ref.current = undefined
      svg.querySelectorAll<SVGPathElement>('[data-snake]').forEach(p => {
        p.style.strokeDasharray = '0 9999'
      })
      return
    }

    // Build path groups: one group per base path, each group has N colored copies
    type Group = { totalLen: number; segLen: number; els: SVGPathElement[] }
    const groups: Group[] = PATHS.map((_, pi) => {
      const els = Array.from(svg.querySelectorAll<SVGPathElement>(`[data-pi="${pi}"]`))
      const totalLen = els[0]?.getTotalLength() ?? 0
      const segLen = (totalLen / N) * 0.8 // each color covers ~80% of its 1/N slice
      els.forEach(p => { p.style.strokeDasharray = `${segLen} ${totalLen - segLen}` })
      return { totalLen, segLen, els }
    })

    const DURATION = 1600 // ms for one full loop

    const tick = (ts: number) => {
      if (!t0Ref.current) t0Ref.current = ts
      const elapsed = (ts - t0Ref.current) % DURATION
      const progress = elapsed / DURATION // 0 → 1

      groups.forEach(({ totalLen, segLen, els }) => {
        if (totalLen === 0) return
        const headPos = progress * totalLen
        els.forEach((p, ci) => {
          // Each color segment trails behind the head by ci * segLen
          const pos = ((headPos - ci * segLen) % totalLen + totalLen) % totalLen
          p.style.strokeDashoffset = String(totalLen - pos)
        })
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = undefined
    }
  }, [active])

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Base icon — dimmed when snake is active */}
      {PATHS.map((d, pi) => (
        <path key={`base-${pi}`} d={d} stroke="currentColor" opacity={active ? 0.12 : 1} />
      ))}

      {/* Snake segments: N colored copies of each path, animated via rAF */}
      {PATHS.map((d, pi) =>
        COLORS.map((color, ci) => (
          <path
            key={`snake-${pi}-${ci}`}
            d={d}
            stroke={color}
            strokeLinecap="round"
            data-snake=""
            data-pi={String(pi)}
            style={{ strokeDasharray: '0 9999' }}
          />
        ))
      )}
    </svg>
  )
}
