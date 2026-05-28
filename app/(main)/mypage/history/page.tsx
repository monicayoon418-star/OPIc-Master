import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'

export default async function HistoryPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const exams = await prisma.exam.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    include: { _count: { select: { answers: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/mypage" className="text-toss-gray500 hover:text-toss-dark"><Icon icon="solar:arrow-left-linear" /></Link>
        <h1 className="text-2xl font-bold text-toss-dark">시험 내역</h1>
      </div>

      {exams.length === 0 ? (
        <div className="py-20 text-center text-toss-gray400">
          <Icon icon="solar:document-bold-duotone" className="text-5xl mx-auto mb-4 block" />
          <p className="font-semibold mb-2">아직 응시한 시험이 없습니다</p>
          <Link href="/exam" className="text-sm text-toss-blue hover:underline">첫 모의고사 시작하기</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {exams.map(exam => {
            const questions = exam.questions as any[]
            return (
              <Link key={exam.id} href={`/exam/result/${exam.id}`} className="flex items-center gap-4 p-5 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 hover:shadow-sm transition-all">
                <div className="w-12 h-12 bg-toss-blueLight rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon icon="solar:document-bold-duotone" className="text-xl text-toss-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-toss-dark">난이도 {exam.difficulty1}단계 모의고사</p>
                  <div className="flex items-center gap-3 text-sm text-toss-gray500 mt-1">
                    <span>{formatDate(exam.createdAt.toISOString())}</span>
                    <span>{questions.length}문항</span>
                    <span className="text-toss-green">{exam._count.answers}개 답변</span>
                  </div>
                </div>
                {exam.targetLevel && (
                  <span className="px-2.5 py-1 bg-toss-blueLight text-toss-blue rounded-full text-xs font-bold">목표 {exam.targetLevel}</span>
                )}
                <Icon icon="solar:arrow-right-linear" className="text-toss-gray400 flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
