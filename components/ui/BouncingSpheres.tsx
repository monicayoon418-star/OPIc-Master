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
  { r: 380, color: '#dbeafe', blur: 110, opacity: 0.88 }, // 연한 하늘색
  { r: 300, color: '#c4b5fd', blur: 85,  opacity: 0.80 }, // 연보라
  { r: 240, color: '#7dd3fc', blur: 75,  opacity: 0.78 }, // 하늘색
  { r: 220, color: '#86efac', blur: 70,  opacity: 0.75 }, // 연두색
  { r: 200, color: '#3b82f6', blur: 55,  opacity: 0.80 }, // 진한 파랑
  { r: 180, color: '#bbf7d0', blur: 65,  opacity: 0.72 }, // 민트 연두
]

// 시작 위치: 좌우로 분산 (x: 좌측 0.1~0.4 / 우측 0.6~0.9)
const INITIAL_POS = [
  { x: 0.15, y: 0.20 }, // 좌상
  { x: 0.78, y: 0.15 }, // 우상
  { x: 0.12, y: 0.70 }, // 좌하
  { x: 0.80, y: 0.68 }, // 우하
  { x: 0.30, y: 0.45 }, // 중앙좌
  { x: 0.68, y: 0.50 }, // 중앙우
]

const SPEEDS = [
  { vx:  0.60, vy:  0.45 },
  { vx: -0.90, vy:  0.70 },
  { vx:  0.75, vy: -0.80 },
  { vx: -0.65, vy:  0.90 },
  { vx:  0.85, vy: -0.55 },
  { vx: -0.70, vy: -0.65 },
]

export default function BouncingSpheres() {
  const containerRef = useRef<HTMLDivElement>(null)
  const statesRef   = useRef<SphereState[]>([])
  const domsRef     = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null, null])
  const rafRef      = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cw = container.offsetWidth
    const ch = container.offsetHeight

    statesRef.current = SPHERE_CONFIGS.map((cfg, i) => ({
      x: cw * INITIAL_POS[i].x,
      y: ch * INITIAL_POS[i].y,
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
            background:   `radial-gradient(circle at 50% 50%, ${cfg.color} 0%, ${cfg.color}cc 25%, ${cfg.color}55 55%, transparent 75%)`,
            filter:       `blur(${cfg.blur}px)`,
            opacity:      cfg.opacity,
          }}
        />
      ))}
    </div>
  )
}
