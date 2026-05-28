import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'

export default async function ExamPage() {
  const session = await auth()
  if (!session) redirect('/login?next=/exam')

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-toss-dark mb-3">모의고사</h1>
        <p className="text-toss-gray600 keep-all">
          실제 OPIc 시험과 동일한 환경에서 모의고사를 응시하세요.
          키워드 설정부터 시험까지 단계별로 진행합니다.
        </p>
      </div>

      {/* 시험 안내 */}
      <div className="bg-toss-blueLight border border-toss-blue/20 rounded-3xl p-6 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Icon icon="solar:info-circle-bold-duotone" className="text-2xl text-toss-blue" />
          <h2 className="font-bold text-toss-dark">시험 전 확인사항</h2>
        </div>
        <ul className="space-y-2 text-sm text-toss-gray700">
          {[
            '시험 제한 시간은 40분이며, 도중에 일시 정지할 수 없습니다.',
            '마이크 사용이 가능한 환경인지 확인해주세요.',
            '조용한 공간에서 응시하는 것을 권장합니다.',
            '시험 시작 전 브라우저에서 마이크 권한을 허용해주세요.',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <Icon icon="solar:check-circle-bold" className="text-toss-blue flex-shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 시험 단계 */}
      <div className="bg-white border border-toss-gray100 rounded-3xl p-6 mb-8 space-y-4">
        <h2 className="font-bold text-toss-dark mb-2">모의고사 진행 단계</h2>
        {[
          { step: '1', title: '난이도 선택', desc: '1~6단계 중 본인 수준 선택' },
          { step: '2', title: '키워드 선택', desc: '직업, 취미, 운동 등 12개 이상 선택' },
          { step: '3', title: '문제 생성', desc: 'AI가 맞춤 문제를 생성합니다' },
          { step: '4', title: '시험 응시', desc: '40분 내 12~15문제 음성 답변' },
          { step: '5', title: '결과 확인', desc: '시험지 조회 및 녹음 다시 듣기' },
        ].map((item) => (
          <div key={item.step} className="flex items-center gap-4">
            <div className="w-8 h-8 bg-toss-gray100 rounded-full flex items-center justify-center text-toss-gray600 font-bold text-sm flex-shrink-0">{item.step}</div>
            <div>
              <p className="font-semibold text-sm text-toss-dark">{item.title}</p>
              <p className="text-xs text-toss-gray500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <Link href="/exam/setup/difficulty">
        <Button size="lg" fullWidth className="text-base">
          <Icon icon="solar:play-bold" className="text-xl mr-2" />
          모의고사 시작하기
        </Button>
      </Link>
    </div>
  )
}
