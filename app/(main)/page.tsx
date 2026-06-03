'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const OPIC_STATS = [
  { icon: 'solar:users-group-rounded-bold-duotone', color: 'text-toss-blue', value: '47,200+', label: '누적 응시자' },
  { icon: 'solar:diploma-bold-duotone', color: 'text-toss-green', value: '4,800+', label: '기출 문제 DB' },
  { icon: 'solar:bolt-bold-duotone', color: 'text-toss-yellow', value: 'AI 기반', label: '맞춤 문제 생성' },
  { icon: 'solar:shield-check-bold-duotone', color: 'text-purple-500', value: '무료', label: '회원가입 후 이용' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: 'solar:settings-bold-duotone', title: '난이도 & 키워드 설정', desc: '나의 직업, 취미, 관심사를 선택하고 목표 등급을 설정합니다.' },
  { step: '02', icon: 'solar:magic-stick-bold-duotone', title: 'AI 맞춤 문제 생성', desc: '기출 문제 데이터를 기반으로 AI가 나만의 예상 문제를 즉시 생성합니다.' },
  { step: '03', icon: 'solar:download-bold-duotone', title: '저장 & 다운로드', desc: '생성된 문제를 마이페이지에 저장하거나 텍스트 파일로 다운로드합니다.' },
]

export default function LandingPage() {
  const blobWrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // reveal 애니메이션
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // 스크롤 패럴랙스
    const onScroll = () => {
      if (!blobWrapRef.current) return
      const y = window.scrollY
      blobWrapRef.current.style.transform = `translateY(${y * 0.35}px)`
      blobWrapRef.current.style.opacity = String(Math.max(0, 1 - y / 500))
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen -mt-16 flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-[#f0f4f8]">
        {/* Blob background */}
        <div ref={blobWrapRef} className="absolute inset-0 -z-10 overflow-hidden will-change-transform">
          {/* 상단 우측 진한 파란색 */}
          <div style={{
            position: 'absolute', borderRadius: '50%', filter: 'blur(90px)',
            width: '50%', height: '57%', background: '#5a99ff', top: '-25%', right: '-15%',
            animation: 'blob-float 2s infinite ease-in-out alternate, blob-color-blue 2s infinite ease-in-out alternate',
          }} />
          {/* 좌측 하단 연한 파란색 */}
          <div style={{
            position: 'absolute', borderRadius: '50%', filter: 'blur(90px)',
            width: '57%', height: '57%', background: '#b5d1ff', bottom: '-35%', left: '-25%',
            animation: 'blob-float 2.5s infinite ease-in-out alternate, blob-color-lightblue 2.5s infinite ease-in-out alternate',
            animationDelay: '-1s, -1s',
          }} />
          {/* 중앙 화이트 톤 */}
          <div style={{
            position: 'absolute', borderRadius: '50%', filter: 'blur(90px)',
            width: '43%', height: '50%', background: '#ffffff', top: '15%', left: '18%',
            animation: 'blob-float 3s infinite ease-in-out alternate, blob-color-white 3s infinite ease-in-out alternate',
            animationDelay: '-2s, -2s',
          }} />
          {/* 노이즈 오버레이 */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ opacity: 0.45, mixBlendMode: 'overlay' }}
            xmlns="http://www.w3.org/2000/svg">
            <filter id="noiseFilter">
              <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter="url(#noiseFilter)" />
          </svg>
          {/* 하단 페이드 아웃 → 흰 배경과 자연스럽게 연결 */}
          <div className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, #ffffff)' }} />
        </div>

        <h1 className="reveal keep-all text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6 max-w-4xl" style={{ transitionDelay: '100ms' }}>
          나만의 OPIc 예상 문제를<br />
          <span className="text-toss-blue">AI가 즉시 생성</span>
        </h1>

        <p className="reveal text-lg md:text-xl text-toss-gray600 mb-10 max-w-xl keep-all leading-relaxed" style={{ transitionDelay: '200ms' }}>
          키워드와 목표 등급을 선택하면 기출 문제 기반으로
          나만의 맞춤 예상 문제를 무료로 생성해 드립니다.
        </p>

        <div className="reveal flex flex-col sm:flex-row gap-3 w-full max-w-sm" style={{ transitionDelay: '300ms' }}>
          <Link
            href="/exam"
            className="flex-1 bg-toss-blue hover:bg-toss-blueHover text-white px-8 py-4 rounded-full text-base font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_10px_30px_-10px_rgba(49,130,246,0.6)] flex items-center justify-center whitespace-nowrap"
          >
            모의문제 생성하기
          </Link>
          <a
            href="https://www.opic.or.kr/opics/jsp/view/index.jsp"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white border border-toss-gray200 text-toss-dark px-8 py-4 rounded-full text-base font-bold hover:bg-toss-gray50 transition-all flex items-center justify-center whitespace-nowrap"
          >
            오픽 공홈 바로가기
          </a>
        </div>
      </section>


      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="reveal text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">이렇게 사용하세요</h2>
            <p className="text-lg text-toss-gray600">3단계로 완성되는 OPIc 예상 문제 생성</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={i} className="reveal text-center" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="w-14 h-14 bg-toss-blueLight rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon icon={item.icon} className="text-2xl text-toss-blue" />
                </div>
                <div className="text-xs font-bold text-toss-blue mb-2">{item.step}</div>
                <h3 className="text-lg font-bold mb-2 text-toss-dark">{item.title}</h3>
                <p className="text-sm text-toss-gray600 keep-all leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OPIc Level Info */}
      <section className="py-24 bg-toss-gray50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="reveal text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">오픽 등급 체계</h2>
            <p className="text-lg text-toss-gray600">나의 목표 등급을 확인하세요</p>
          </div>
          <div className="reveal grid grid-cols-4 md:grid-cols-8 gap-3">
            {['NL','NH','IL','IM1','IM2','IM3','IH','AL'].map((level, i) => (
              <div key={level} className={`rounded-2xl p-4 text-center font-bold transition-all hover:scale-105 cursor-default ${
                level === 'AL' ? 'bg-toss-blue text-white shadow-[0_8px_20px_-8px_rgba(49,130,246,0.5)]' :
                level === 'IH' ? 'bg-toss-dark text-white' :
                level.startsWith('IM') ? 'bg-white border-2 border-toss-green text-toss-green' :
                'bg-white border border-toss-gray200 text-toss-gray600'
              }`}>
                <p className="text-sm md:text-base">{level}</p>
                <p className="text-xs mt-1 opacity-70">Lv.{i+1}</p>
              </div>
            ))}
          </div>
          <p className="reveal text-center text-sm text-toss-gray500 mt-6">
            취업 및 대학원 입학에 주로 요구되는 등급: IM2 이상 ~ IH
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 bg-toss-blue text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -top-40 -right-20" />
          <div className="absolute w-[400px] h-[400px] bg-toss-dark/10 rounded-full blur-3xl -bottom-20 -left-10" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <h2 className="reveal text-4xl md:text-5xl font-bold tracking-tight mb-6 keep-all">
            목표 등급, 지금 바로<br />도전하세요.
          </h2>
          <p className="reveal text-lg text-white/80 mb-10 keep-all" style={{ transitionDelay: '100ms' }}>
            회원가입 후 무제한 문제 생성과 커뮤니티를 무료로 이용하세요.
          </p>
          <div className="reveal" style={{ transitionDelay: '200ms' }}>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-white text-toss-blue px-10 py-4 rounded-full text-lg font-bold hover:bg-toss-gray50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
            >
              무료로 시작하기
              <Icon icon="solar:arrow-right-linear" className="text-xl" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
