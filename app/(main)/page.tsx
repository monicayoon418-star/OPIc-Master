'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const HOW_IT_WORKS = [
  { step: '01', icon: 'solar:settings-bold-duotone', title: '난이도 & 키워드 설정', desc: '나의 직업, 취미, 관심사를 선택하고 목표 등급을 설정합니다.' },
  { step: '02', icon: 'solar:document-bold-duotone', title: '기출 문제 기반 생성', desc: '실제 OPIc 기출 문제 데이터에서 내 키워드에 맞는 문제를 제공합니다.' },
  { step: '03', icon: 'solar:download-bold-duotone', title: '저장 & 다운로드', desc: '생성된 문제를 마이페이지에 저장하거나 텍스트 파일로 다운로드합니다.' },
]

export default function LandingPage() {
  const rightVisualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // reveal 애니메이션
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

    // 우측 비주얼 패럴랙스
    const onScroll = () => {
      if (!rightVisualRef.current) return
      const y = window.scrollY
      rightVisualRef.current.style.transform = `translateY(${y * 0.12}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen -mt-16 flex items-center bg-white overflow-hidden px-4">
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-8 items-center pt-24 pb-20">

          {/* 왼쪽: 텍스트 + 버튼 */}
          <div>
            <p className="reveal text-sm font-semibold text-toss-blue mb-4 tracking-widest uppercase" style={{ transitionDelay: '0ms' }}>
              OPIc 예상 문제 생성 서비스
            </p>
            <h1 className="reveal text-5xl lg:text-6xl font-bold text-toss-dark leading-[1.1] mb-6 keep-all" style={{ transitionDelay: '80ms' }}>
              실제 기출로<br />준비하는<br />
              <span className="text-toss-blue">OPIc 학습</span>
            </h1>
            <p className="reveal text-base lg:text-lg text-toss-gray600 mb-10 keep-all leading-relaxed max-w-md" style={{ transitionDelay: '160ms' }}>
              실제 OPIc 기출 문제 데이터를 바탕으로<br />
              키워드와 목표 등급을 선택하면<br />
              나만의 맞춤 예상 문제를 즉시 제공합니다.<br />
              지금 바로 무료로 시작해보세요.
            </p>
            <div className="reveal flex flex-col sm:flex-row gap-3 w-full max-w-sm" style={{ transitionDelay: '240ms' }}>
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
          </div>

          {/* 오른쪽: 글로우 비주얼 */}
          <div ref={rightVisualRef} className="relative flex items-center justify-center h-[420px] lg:h-[500px]">
            {/* 글로우 블롭 레이어들 */}
            <div className="absolute w-[380px] h-[380px] rounded-full"
              style={{ background: 'radial-gradient(circle at 40% 50%, #3182f6 0%, #7ab3ff 45%, transparent 70%)', filter: 'blur(48px)', opacity: 0.55 }} />
            <div className="absolute w-[280px] h-[280px] rounded-full"
              style={{ background: 'radial-gradient(circle at 60% 40%, #a8c8ff 0%, #3182f6 50%, transparent 75%)', filter: 'blur(36px)', opacity: 0.45, transform: 'translate(40px, -20px)' }} />
            <div className="absolute w-[200px] h-[200px] rounded-full"
              style={{ background: 'radial-gradient(circle, #e8f3ff 0%, #7ab3ff 60%, transparent 80%)', filter: 'blur(24px)', opacity: 0.6, transform: 'translate(-30px, 30px)' }} />

            {/* 세로 슬릿 오버레이 (CRUNCHY 스타일) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-3xl">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-full w-px bg-white/20 mx-8" />
              ))}
            </div>

            {/* OPIc Master 텍스트 */}
            <div className="relative z-10 text-center select-none">
              <p className="text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-[0_2px_24px_rgba(49,130,246,0.8)]">
                OPIc Master
              </p>
              <p className="text-sm text-white/70 mt-2 font-medium tracking-widest">기출 문제 기반 학습</p>
            </div>
          </div>
        </div>

        {/* 스크롤 다운 화살표 */}
        <button
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-toss-gray400 hover:text-toss-blue transition-colors group"
        >
          <span className="text-xs font-medium tracking-widest">SCROLL</span>
          <Icon icon="solar:arrow-down-linear" className="text-xl animate-bounce" />
        </button>
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
