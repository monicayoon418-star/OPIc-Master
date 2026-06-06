'use client'

// Blobs are intentionally oversized (160-180% viewport) so edges never clip while translating.
export default function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ background: '#03091e' }}>

      {/* Blob A — white/pale-blue, bright top region */}
      <div className="absolute" style={{
        width: '180%', height: '140%',
        top: '-50%', left: '-40%',
        background: 'radial-gradient(ellipse 45% 50% at 48% 42%, rgba(210,230,255,0.60) 0%, rgba(150,195,255,0.35) 35%, transparent 62%)',
        filter: 'blur(50px)',
        animation: 'hbg-blob-a 9s ease-in-out infinite',
      }} />

      {/* Blob B — vivid cobalt blue, center-left */}
      <div className="absolute" style={{
        width: '180%', height: '150%',
        top: '-25%', left: '-50%',
        background: 'radial-gradient(ellipse 52% 58% at 42% 54%, rgba(25,85,255,0.88) 0%, rgba(12,50,200,0.55) 42%, transparent 68%)',
        filter: 'blur(35px)',
        animation: 'hbg-blob-b 12s ease-in-out infinite 1s',
      }} />

      {/* Blob C — mid-blue, center sweep */}
      <div className="absolute" style={{
        width: '170%', height: '130%',
        top: '-15%', left: '-35%',
        background: 'radial-gradient(ellipse 38% 48% at 56% 52%, rgba(40,100,240,0.65) 0%, rgba(18,60,180,0.32) 46%, transparent 70%)',
        filter: 'blur(40px)',
        animation: 'hbg-blob-c 7s ease-in-out infinite 2s',
      }} />

      {/* Blob D — deep navy, counter-moves right */}
      <div className="absolute" style={{
        width: '160%', height: '140%',
        top: '-20%', left: '-10%',
        background: 'radial-gradient(ellipse 40% 45% at 62% 60%, rgba(8,30,120,0.7) 0%, rgba(4,15,70,0.4) 45%, transparent 68%)',
        filter: 'blur(45px)',
        animation: 'hbg-blob-d 10s ease-in-out infinite 0.5s',
      }} />

      {/* Blob E — light shimmer, roaming highlight */}
      <div className="absolute" style={{
        width: '160%', height: '130%',
        top: '-30%', left: '-30%',
        background: 'radial-gradient(ellipse 28% 35% at 50% 45%, rgba(170,210,255,0.45) 0%, rgba(100,170,255,0.2) 40%, transparent 65%)',
        filter: 'blur(55px)',
        animation: 'hbg-blob-e 15s ease-in-out infinite 3s',
      }} />

      {/* Bottom fade to dark */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: '30%',
        background: 'linear-gradient(to top, rgba(2,6,20,0.85) 0%, transparent 100%)',
      }} />

    </div>
  )
}
