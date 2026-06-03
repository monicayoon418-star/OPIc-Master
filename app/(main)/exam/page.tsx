import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'

export default async function GeneratePage() {
  const session = await auth()
  if (!session) redirect('/login?next=/exam')

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-toss-dark mb-3">문제 생성</h1>
        <p className="text-toss-gray600 keep-all">
          AI를 활용한 유사 기출문제를 바탕으로 나의 키워드와 목표 등급에 맞는 예상 문제를 제공합니다.
        </p>
      </div>

      <div className="bg-toss-blueLight border border-toss-blue/20 rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon icon="solar:document-bold-duotone" className="text-2xl text-toss-blue" />
          <h2 className="font-bold text-toss-dark">이런 분들에게 추천해요</h2>
        </div>
        <ul className="space-y-2 text-sm text-toss-gray700">
          {[
            '시험 전 나의 배경에 맞는 예상 문제를 뽑아 연습하고 싶은 분',
            '목표 등급에 맞는 난이도로 공부하고 싶은 분',
            '실제 출제 경향을 파악하고 싶은 분',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon icon="solar:check-circle-bold" className="text-toss-blue flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-toss-gray100 rounded-3xl p-6 mb-8 space-y-4">
        <h2 className="font-bold text-toss-dark mb-2">문제 생성 단계</h2>
        {[
          { step: '1', title: '난이도 선택', desc: '1~6단계 중 본인 수준 선택, 목표 등급 설정' },
          { step: '2', title: '키워드 선택', desc: '직업, 취미, 운동 등 12개 이상 선택' },
          { step: '3', title: '문제 생성', desc: 'AI를 활용한 유사 기출문제로 맞춤 예상 문제 제공' },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-4">
            <div className="w-8 h-8 bg-toss-blueLight rounded-full flex items-center justify-center text-toss-blue font-bold text-sm flex-shrink-0">{item.step}</div>
            <div>
              <p className="font-semibold text-sm text-toss-dark">{item.title}</p>
              <p className="text-xs text-toss-gray500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/exam/setup/difficulty">
        <Button size="lg" fullWidth className="text-base">
          <Icon icon="solar:document-bold" className="text-xl mr-2" />
          문제 생성 시작하기
        </Button>
      </Link>
    </div>
  )
}
