import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'
import type { ExamQuestion } from '@/types'

export default async function SavedSetsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const savedItems = await prisma.savedItem.findMany({
    where: { userId: session.user.id, generatedSetId: { not: null } },
    include: {
      generatedSet: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/mypage" className="text-toss-gray500 hover:text-toss-dark">
          <Icon icon="solar:arrow-left-linear" />
        </Link>
        <h1 className="text-2xl font-bold text-toss-dark">저장한 문제 세트</h1>
      </div>

      {savedItems.length === 0 ? (
        <div className="py-20 text-center text-toss-gray400">
          <Icon icon="solar:document-bold-duotone" className="text-5xl mx-auto mb-4 block" />
          <p className="font-semibold mb-2">저장한 문제 세트가 없습니다</p>
          <Link href="/exam" className="text-sm text-toss-blue hover:underline">문제 생성하러 가기</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {savedItems.map(item => {
            const set = item.generatedSet!
            const questions = set.questions as unknown as ExamQuestion[]
            return (
              <Link
                key={item.id}
                href={`/exam/${set.id}`}
                className="flex items-center gap-4 p-5 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 hover:shadow-sm transition-all"
              >
                <div className="w-12 h-12 bg-toss-blueLight rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:document-bold-duotone" className="text-xl text-toss-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-toss-dark">난이도 {set.difficulty1}단계 · 목표 {set.targetLevel}</p>
                  <div className="flex items-center gap-3 text-sm text-toss-gray500 mt-1">
                    <span>{formatDate(set.createdAt.toISOString())}</span>
                    <span>{questions.length}문항</span>
                  </div>
                </div>
                <Icon icon="solar:arrow-right-linear" className="text-toss-gray400 flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
