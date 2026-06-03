'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import BouncingSpheres from '@/components/ui/BouncingSpheres'

const HOW_IT_WORKS = [
  { step: '01', icon: 'solar:settings-bold-duotone', title: '난이도 & 키워드 설정', desc: '나의 직업, 취미, 관심사를 선택하고 목표 등급을 설정합니다.' },
  { step: '02', icon: 'solar:document-bold-duotone', title: '기출 문제 기반 생성', desc: '실제 OPIc 기출 문제 데이터에서 내 키워드에 맞는 문제를 제공합니다.' },
  { step: '03', icon: 'solar:download-bold-duotone', title: '저장 & 다운로드', desc: '생성된 문제를 마이페이지에 저장하거나 텍스트 파일로 다운로드합니다.' },
]

export default function LandingPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('active')),
      { threshold: 0.1 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToNext = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen -mt-16 flex flex-col items-center justify-center bg-white overflow-hidden px-4">
        <BouncingSpheres />

        {/* 중앙 콘텐츠 */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">

          {/* 상단 레이블 */}
          <p
            className="reveal text-sm text-toss-gray500 mb-6 tracking-wide"
            style={{ transitionDelay: '0ms' }}
          >
            실제 기출 문제 기반 OPIc 예상 문제 서비스
          </p>

          {/* 메인 타이틀 */}
          <h1
            className="reveal text-5xl md:text-7xl font-bold text-toss-dark leading-[1.08] tracking-tight mb-8 keep-all"
            style={{ transitionDelay: '80ms' }}
          >
            OPIc Master
          </h1>

          {/* 설명글 */}
          <p
            className="reveal text-base md:text-lg text-toss-gray500 leading-relaxed mb-10 keep-all max-w-md font-normal"
            style={{ transitionDelay: '160ms' }}
          >
            실제 OPIc 기출 문제 데이터를 바탕으로<br />
            키워드와 목표 등급을 선택하면<br />
            나만의 맞춤 예상 문제를 즉시 제공합니다.
          </p>

          {/* 버튼 */}
          <div
            className="reveal flex flex-col sm:flex-row gap-3"
            style={{ transitionDelay: '240ms' }}
          >
            <Link
              href="/exam"
              className="bg-toss-dark hover:bg-toss-gray800 text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              모의문제 생성하기
            </Link>
            <a
              href="https://www.opic.or.kr/opics/jsp/view/index.jsp"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border border-toss-gray200 text-toss-dark px-8 py-3.5 rounded-full text-sm font-semibold hover:bg-toss-gray50 transition-all"
            >
              오픽 공홈 바로가기
            </a>
          </div>
        </div>

        {/* 스크롤 화살표 */}
        <button
          onClick={scrollToNext}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 text-toss-gray400 hover:text-toss-blue transition-colors"
        >
          <span className="text-xs tracking-widest">SCROLL</span>
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
            회원가입 후 무제한 문제 생성을 무료로 이용하세요.
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
