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

      {/* Wave layer 1 — wide center sweep */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '55%',
          background:
            'radial-gradient(ellipse 120% 80% at 50% 100%, rgba(25,95,255,0.75) 0%, rgba(15,55,190,0.35) 45%, transparent 70%)',
          animation: 'hbg-wave1 4s ease-in-out infinite',
        }}
      />

      {/* Wave layer 2 — left aurora arm */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '42%',
          background:
            'radial-gradient(ellipse 70% 90% at 20% 100%, rgba(18,70,210,0.65) 0%, rgba(10,45,160,0.3) 50%, transparent 72%)',
          animation: 'hbg-wave2 5s ease-in-out infinite 0.6s',
        }}
      />

      {/* Wave layer 3 — right aurora arm */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '42%',
          background:
            'radial-gradient(ellipse 70% 90% at 80% 100%, rgba(18,70,210,0.55) 0%, rgba(10,45,160,0.25) 50%, transparent 72%)',
          animation: 'hbg-wave3 5s ease-in-out infinite 1.2s',
        }}
      />

      {/* Wave layer 4 — shimmer highlight, center-left */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '35%',
          background:
            'radial-gradient(ellipse 90% 70% at 40% 100%, rgba(100,185,255,0.42) 0%, rgba(55,130,255,0.18) 50%, transparent 75%)',
          animation: 'hbg-wave4 3.5s ease-in-out infinite 0.3s',
        }}
      />

      {/* Wave layer 5 — shimmer highlight, center-right */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '30%',
          background:
            'radial-gradient(ellipse 80% 65% at 65% 100%, rgba(80,160,255,0.35) 0%, rgba(40,110,220,0.15) 50%, transparent 75%)',
          animation: 'hbg-wave5 4s ease-in-out infinite 1.8s',
        }}
      />

    </div>
  )
}
