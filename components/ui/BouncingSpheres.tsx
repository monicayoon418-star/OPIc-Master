'use client'

import { useEffect, useRef } from 'react'

interface SphereState {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

const SPHERE_CONFIGS = [
  { r: 260, color: '#a8c8ff', blur: 80, opacity: 0.75 },
  { r: 160, color: '#7ab3ff', blur: 60, opacity: 0.70 },
  { r: 140, color: '#3182f6', blur: 50, opacity: 0.65 },
]

const SPEEDS = [
  { vx: 0.7,  vy: 0.5  },
  { vx: -0.9, vy: 0.75 },
  { vx: 0.55, vy: -0.8 },
]

export default function BouncingSpheres() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statesRef   = useRef<SphereState[]>([])
  const domsRef     = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const rafRef      = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cw = container.offsetWidth
    const ch = container.offsetHeight

    statesRef.current = SPHERE_CONFIGS.map((cfg, i) => ({
      x: cw * (0.2 + i * 0.28),
      y: ch * (0.25 + i * 0.22),
      vx: SPEEDS[i].vx,
      vy: SPEEDS[i].vy,
      r: cfg.r,
    }))

    const tick = () => {
      const w = container.offsetWidth
      const h = container.offsetHeight

      statesRef.current.forEach((s, i) => {
        s.x += s.vx
        s.y += s.vy

        if (s.x - s.r < 0)  { s.x = s.r;    s.vx =  Math.abs(s.vx) }
        if (s.x + s.r > w)  { s.x = w - s.r; s.vx = -Math.abs(s.vx) }
        if (s.y - s.r < 0)  { s.y = s.r;    s.vy =  Math.abs(s.vy) }
        if (s.y + s.r > h)  { s.y = h - s.r; s.vy = -Math.abs(s.vy) }

        const el = domsRef.current[i]
        if (el) el.style.transform = `translate(${s.x - s.r}px, ${s.y - s.r}px)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {SPHERE_CONFIGS.map((cfg, i) => (
        <div
          key={i}
          ref={el => { domsRef.current[i] = el }}
          className="absolute will-change-transform"
          style={{
            width:  cfg.r * 2,
            height: cfg.r * 2,
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 50%, ${cfg.color} 0%, ${cfg.color}99 35%, ${cfg.color}33 65%, transparent 80%)`,
            filter: `blur(${cfg.blur}px)`,
            opacity: cfg.opacity,
          }}
        />
      ))}
    </div>
  )
}
