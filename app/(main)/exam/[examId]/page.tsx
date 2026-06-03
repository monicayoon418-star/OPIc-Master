import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import type { ExamQuestion } from '@/types'
import SaveButton from './SaveButton'

export default async function GeneratedSetPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  const session = await auth()
  if (!session) notFound()

  const set = await prisma.generatedSet.findUnique({
    where: { id: examId },
    include: {
      savedBy: { where: { userId: session.user.id }, select: { id: true } },
    },
  })

  if (!set || set.userId !== session.user.id) notFound()

  const questions = set.questions as unknown as ExamQuestion[]
  const session1 = questions.filter(q => q.session === 1)
  const session2 = questions.filter(q => q.session === 2)
  const isSaved = set.savedBy.length > 0

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-toss-dark mb-1">생성된 문제</h1>
          <p className="text-sm text-toss-gray500">{formatDate(set.createdAt.toISOString())}</p>
        </div>
        <Link href="/mypage/history">
          <Button variant="secondary" size="sm">
            <Icon icon="solar:bookmark-bold" className="mr-1.5" />
            저장 목록
          </Button>
        </Link>
      </div>

      <div className="bg-toss-blueLight/50 border border-toss-blue/20 rounded-2xl p-5 mb-8">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-toss-gray500 text-xs">1차 난이도</span>
            <p className="font-bold text-toss-dark">{set.difficulty1}단계</p>
          </div>
          {set.difficulty2 && (
            <div>
              <span className="text-toss-gray500 text-xs">2차 난이도</span>
              <p className="font-bold text-toss-dark">{set.difficulty2}단계</p>
            </div>
          )}
          <div>
            <span className="text-toss-gray500 text-xs">목표 등급</span>
            <p className="font-bold text-toss-blue">{set.targetLevel}</p>
          </div>
        </div>
      </div>

      {[
        { label: '1차 세션', items: session1 },
        { label: '2차 세션', items: session2 },
      ].filter(s => s.items.length > 0).map(({ label, items }) => (
        <div key={label} className="mb-8">
          <h2 className="font-bold text-toss-dark mb-4">{label} ({items.length}문항)</h2>
          <div className="space-y-3">
            {items.map((q, i) => (
              <div key={q.id} className="border border-toss-gray100 rounded-2xl p-4 hover:border-toss-gray200 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-toss-gray500">Q{i + 1}</span>
                  <span className="text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full font-semibold">{q.category}</span>
                </div>
                <p className="text-sm text-toss-dark leading-relaxed">{q.content}</p>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-3">
        <SaveButton setId={examId} initialSaved={isSaved} />
        <Link href="/exam" className="flex-1">
          <Button fullWidth>
            <Icon icon="solar:magic-stick-bold" className="mr-2" />
            새 문제 생성
          </Button>
        </Link>
      </div>
    </div>
  )
}
