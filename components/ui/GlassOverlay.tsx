export default function GlassOverlay() {
  // 각 인덱스별 blur 값 — 짝수(굴곡 정점)는 강한 blur, 홀수(골)는 약한 blur
  const blurValues = [
    15, 2, 18, 1, 16, 2, 20, 1, 15, 3,
    17, 1, 19, 2, 16, 1, 18, 2, 14, 3,
    17, 1, 16, 2,
  ]
  const bgOpacities = [
    0.13, 0.02, 0.15, 0.01, 0.12, 0.02, 0.16, 0.01, 0.13, 0.02,
    0.14, 0.01, 0.15, 0.02, 0.12, 0.01, 0.14, 0.02, 0.11, 0.02,
    0.13, 0.01, 0.12, 0.02,
  ]

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1, display: 'flex' }}
    >
      {blurValues.map((blur, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: '100%',
            backdropFilter: `blur(${blur}px)`,
            WebkitBackdropFilter: `blur(${blur}px)`,
            background: `rgba(255, 255, 255, ${bgOpacities[i]})`,
          }}
        />
      ))}
    </div>
  )
}
