import Link from 'next/link'
import { Icon } from '@iconify/react'

export default function CommunityPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-toss-dark mb-2">커뮤니티</h1>
        <p className="text-toss-gray600">OPIc 학습 정보와 후기를 공유하세요.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <Link href="/community/reviews" className="group bg-white border border-toss-gray100 rounded-3xl p-8 hover:border-toss-blue/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all">
          <div className="w-14 h-14 bg-toss-blueLight rounded-2xl flex items-center justify-center mb-5">
            <Icon icon="solar:chat-round-like-bold-duotone" className="text-2xl text-toss-blue" />
          </div>
          <h2 className="text-xl font-bold text-toss-dark mb-2">오픽 후기</h2>
          <p className="text-toss-gray600 text-sm keep-all">실제 시험 경험과 등급 달성 후기를 공유해요.</p>
          <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-toss-blue">
            후기 보러가기
            <Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>

        <Link href="/community/study-tips" className="group bg-white border border-toss-gray100 rounded-3xl p-8 hover:border-toss-blue/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-5">
            <Icon icon="solar:lightbulb-bold-duotone" className="text-2xl text-toss-green" />
          </div>
          <h2 className="text-xl font-bold text-toss-dark mb-2">공부법 후기</h2>
          <p className="text-toss-gray600 text-sm keep-all">효과적인 OPIc 공부법과 꿀팁을 나눠요.</p>
          <div className="flex items-center gap-1 mt-4 text-sm font-semibold text-toss-green">
            꿀팁 보러가기
            <Icon icon="solar:arrow-right-linear" className="group-hover:translate-x-1 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  )
}
