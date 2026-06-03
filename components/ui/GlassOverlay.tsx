'use client'

export default function GlassOverlay() {
  const NUM = 26

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1, display: 'flex' }}
    >
      {Array.from({ length: NUM }, (_, i) => {
        const isCurved = i % 2 === 0
        const curveIntensity = 0.8 + (i % 5) * 0.12  // 리브마다 강도 변화

        if (isCurved) {
          return (
            <div
              key={i}
              className="relative flex-1 h-full"
              style={{
                backdropFilter: `blur(${12 + (i % 4)  * 1.5}px)`,
                WebkitBackdropFilter: `blur(${12 + (i % 4) * 1.5}px)`,
                background: [
                  // 테두리 그림자 (깊이감)
                  `linear-gradient(90deg, rgba(0,0,0,0.14) 0%, transparent 18%, transparent 82%, rgba(0,0,0,0.10) 100%)`,
                  // 타원형 왼쪽 하이라이트 (빛 반사)
                  `radial-gradient(ellipse at 18% 50%, rgba(255,255,255,${0.72 * curveIntensity}) 0%, rgba(255,255,255,0) 55%)`,
                  // 타원형 오른쪽 하이라이트
                  `radial-gradient(ellipse at 82% 50%, rgba(255,255,255,${0.50 * curveIntensity}) 0%, rgba(255,255,255,0) 45%)`,
                  // 바디 — 반투명 유리
                  `linear-gradient(90deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)`,
                ].join(', '),
              }}
            >
              {/* 얇은 반사 하이라이트 선 */}
              <div
                className="absolute top-0 bottom-0"
                style={{
                  left: '10%',
                  width: '7%',
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    rgba(255,255,255,${0.88 * curveIntensity}) 40%,
                    rgba(255,255,255,${0.60 * curveIntensity}) 60%,
                    transparent 100%
                  )`,
                  filter: 'blur(1px)',
                }}
              />
              {/* 우측 보조 반사선 */}
              <div
                className="absolute top-0 bottom-0"
                style={{
                  right: '8%',
                  width: '5%',
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    rgba(255,255,255,${0.55 * curveIntensity}) 50%,
                    transparent 100%
                  )`,
                  filter: 'blur(0.5px)',
                }}
              />
            </div>
          )
        }

        // 골(valley) — 거의 투명, 낮은 blur
        return (
          <div
            key={i}
            className="flex-1 h-full"
            style={{
              backdropFilter: 'blur(1.5px)',
              WebkitBackdropFilter: 'blur(1.5px)',
              background: 'rgba(255,255,255,0.01)',
            }}
          />
        )
      })}
    </div>
  )
}
