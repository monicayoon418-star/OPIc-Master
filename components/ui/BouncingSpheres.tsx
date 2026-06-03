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
  { r: 270, color: '#b5d1ff', blur: 70,  opacity: 0.85 },
  { r: 150, color: '#7ab3ff', blur: 45,  opacity: 0.80 },
  { r: 120, color: '#3182f6', blur: 20,  opacity: 0.75 },
]

const SPEEDS = [
  { vx: 1.10,  vy: 0.80  },
  { vx: -1.50, vy: 1.20  },
  { vx: 1.30,  vy: -1.40 },
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
      x: cw * (0.18 + i * 0.32),
      y: ch * (0.30 + i * 0.20),
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
            width:        cfg.r * 2,
            height:       cfg.r * 2,
            borderRadius: '50%',
            background:   `radial-gradient(circle at 50% 50%, ${cfg.color} 0%, ${cfg.color}bb 30%, ${cfg.color}44 60%, transparent 80%)`,
            filter:       `blur(${cfg.blur}px)`,
            opacity:      cfg.opacity,
          }}
        />
      ))}
    </div>
  )
}
