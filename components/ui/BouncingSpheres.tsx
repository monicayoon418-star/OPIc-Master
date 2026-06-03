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
  { r: 220, color: '#3182f6' },
  { r: 180, color: '#7ab3ff' },
  { r: 150, color: '#a8c8ff' },
]

export default function BouncingSpheres() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statesRef = useRef<SphereState[]>([])
  const domsRef = useRef<(HTMLDivElement | null)[]>([null, null, null])
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cw = container.offsetWidth
    const ch = container.offsetHeight

    statesRef.current = SPHERE_CONFIGS.map((cfg, i) => ({
      x: cw * (0.2 + i * 0.3),
      y: ch * (0.2 + i * 0.25),
      vx: (0.8 + i * 0.3) * (i % 2 === 0 ? 1 : -1),
      vy: (0.6 + i * 0.25) * (i % 2 === 0 ? 1 : -1),
      r: cfg.r,
    }))

    const tick = () => {
      const w = container.offsetWidth
      const h = container.offsetHeight

      statesRef.current.forEach((s, i) => {
        s.x += s.vx
        s.y += s.vy

        if (s.x - s.r < 0)  { s.x = s.r;     s.vx =  Math.abs(s.vx) }
        if (s.x + s.r > w)  { s.x = w - s.r;  s.vx = -Math.abs(s.vx) }
        if (s.y - s.r < 0)  { s.y = s.r;     s.vy =  Math.abs(s.vy) }
        if (s.y + s.r > h)  { s.y = h - s.r;  s.vy = -Math.abs(s.vy) }

        const el = domsRef.current[i]
        if (el) el.style.transform = `translate(${s.x - s.r}px, ${s.y - s.r}px)`
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {SPHERE_CONFIGS.map((cfg, i) => (
        <div
          key={i}
          ref={el => { domsRef.current[i] = el }}
          className="absolute will-change-transform"
          style={{
            width: cfg.r * 2,
            height: cfg.r * 2,
            borderRadius: '50%',
            background: [
              'radial-gradient(circle at 32% 28%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.0) 40%)',
              `radial-gradient(circle at 50% 50%, ${cfg.color}55 0%, ${cfg.color}22 55%, transparent 75%)`,
            ].join(', '),
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            border: '1px solid rgba(255,255,255,0.45)',
            boxShadow: [
              `0 12px 48px ${cfg.color}33`,
              `inset 0 1px 0 rgba(255,255,255,0.7)`,
              `inset 0 -2px 8px rgba(255,255,255,0.1)`,
            ].join(', '),
          }}
        />
      ))}
    </div>
  )
}
