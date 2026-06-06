'use client'

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#020b1c' }}>

      {/* Base blue radial — bottom-left vivid blue */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 130% 95% at -10% 108%, rgba(30,100,255,0.95) 0%, rgba(15,55,180,0.65) 28%, rgba(5,20,80,0.3) 55%, transparent 72%)',
          animation: 'hbg-base 14s ease-in-out infinite',
        }}
      />

      {/* Diagonal beam — the bright sweep in the image */}
      <div
        className="absolute"
        style={{
          inset: 0,
          background:
            'radial-gradient(ellipse 75% 55% at 20% 80%, rgba(140,200,255,0.55) 0%, rgba(80,160,255,0.3) 30%, transparent 62%)',
          filter: 'blur(22px)',
          animation: 'hbg-beam 8s ease-in-out infinite',
        }}
      />

      {/* Top-right dark vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 95% 2%, rgba(0,3,12,0.92) 0%, rgba(0,5,20,0.5) 45%, transparent 70%)',
        }}
      />

      {/* Wave layer 1 */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '48%',
          background:
            'radial-gradient(ellipse 110% 85% at 8% 100%, rgba(25,95,255,0.82) 0%, rgba(15,55,190,0.45) 38%, transparent 68%)',
          animation: 'hbg-wave1 4s ease-in-out infinite',
        }}
      />

      {/* Wave layer 2 */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '38%',
          background:
            'radial-gradient(ellipse 80% 90% at 45% 100%, rgba(18,70,210,0.6) 0%, rgba(10,45,160,0.3) 48%, transparent 72%)',
          animation: 'hbg-wave2 5s ease-in-out infinite 0.6s',
        }}
      />

      {/* Wave layer 3 — shimmer highlight */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '32%',
          background:
            'radial-gradient(ellipse 55% 75% at 22% 100%, rgba(100,185,255,0.48) 0%, rgba(55,130,255,0.2) 50%, transparent 75%)',
          animation: 'hbg-wave3 3.5s ease-in-out infinite 1s',
        }}
      />

      {/* Wave layer 4 — rightward counter-wave */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '28%',
          background:
            'radial-gradient(ellipse 60% 80% at 72% 100%, rgba(40,110,240,0.42) 0%, rgba(20,65,180,0.18) 50%, transparent 72%)',
          animation: 'hbg-wave4 4.5s ease-in-out infinite 0.3s',
        }}
      />

    </div>
  )
}
