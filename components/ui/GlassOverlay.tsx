export default function GlassOverlay() {
  const stripes = [
    { left: '-1%',  width: '20%', opacity: 0.18, blur: 10 },
    { left: '17%',  width: '16%', opacity: 0.11, blur: 14 },
    { left: '31%',  width: '20%', opacity: 0.15, blur: 10 },
    { left: '49%',  width: '15%', opacity: 0.09, blur: 16 },
    { left: '62%',  width: '21%', opacity: 0.16, blur: 10 },
    { left: '81%',  width: '22%', opacity: 0.13, blur: 12 },
  ]

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {stripes.map((s, i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0"
          style={{
            left: s.left,
            width: s.width,
            backdropFilter: `blur(${s.blur}px)`,
            WebkitBackdropFilter: `blur(${s.blur}px)`,
            background: `linear-gradient(
              90deg,
              transparent 0%,
              rgba(255,255,255,${s.opacity}) 30%,
              rgba(255,255,255,${s.opacity + 0.04}) 50%,
              rgba(255,255,255,${s.opacity}) 70%,
              transparent 100%
            )`,
          }}
        />
      ))}
    </div>
  )
}
