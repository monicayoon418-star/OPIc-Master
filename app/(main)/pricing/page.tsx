import Link from 'next/link'
import { Icon } from '@iconify/react'

export default function PricingPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 bg-toss-blueLight rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Icon icon="solar:card-bold-duotone" className="text-3xl text-toss-blue" />
      </div>
      <h1 className="text-2xl font-bold text-toss-dark mb-3">유료 플랜 준비 중</h1>
      <p className="text-toss-gray600 mb-8 keep-all leading-relaxed">
        유료 결제 서비스는 현재 준비 중입니다.<br />
        그동안 기출 문제 기반 무료 생성을 이용해 주세요.
      </p>
      <Link
        href="/exam/setup/preview"
        className="inline-flex items-center gap-2 bg-toss-blue text-white px-8 py-3.5 rounded-full font-bold hover:bg-toss-blueHover transition-colors"
      >
        <Icon icon="solar:arrow-left-linear" />
        돌아가기
      </Link>
    </div>
  )
}
