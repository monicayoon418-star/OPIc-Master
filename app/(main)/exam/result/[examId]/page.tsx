import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getPresignedDownloadUrl } from '@/lib/s3'
import { formatDuration, formatDate } from '@/lib/utils'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default async function ExamResultPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  const session = await auth()
  if (!session) notFound()

  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: { answers: true },
  })

  if (!exam || exam.userId !== session.user.id) notFound()

  const questions = exam.questions as { content: string; category: string; session: number }[]

  const answersWithUrls = await Promise.all(
    exam.answers.map(async (ans) => ({
      ...ans,
      audioUrl: ans.audioKey ? await getPresignedDownloadUrl(ans.audioKey) : null,
    }))
  )

  const answerMap = Object.fromEntries(answersWithUrls.map(a => [a.questionIndex, a]))
  const totalDuration = exam.answers.reduce((s, a) => s + (a.duration ?? 0), 0)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-toss-dark mb-1">시험 결과</h1>
          <p className="text-sm text-toss-gray500">{formatDate(exam.createdAt.toISOString())}</p>
        </div>
        <Link href="/mypage/history">
          <Button variant="secondary" size="sm">
            <Icon icon="solar:history-bold" className="mr-1.5" />
            전체 내역
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-toss-gray50 rounded-2xl p-4 text-center">
          <p className="text-xs text-toss-gray500 mb-1">총 문항</p>
          <p className="text-2xl font-bold text-toss-dark">{questions.length}</p>
        </div>
        <div className="bg-toss-gray50 rounded-2xl p-4 text-center">
          <p className="text-xs text-toss-gray500 mb-1">답변 완료</p>
          <p className="text-2xl font-bold text-toss-green">{exam.answers.length}</p>
        </div>
        <div className="bg-toss-gray50 rounded-2xl p-4 text-center">
          <p className="text-xs text-toss-gray500 mb-1">총 답변 시간</p>
          <p className="text-2xl font-bold text-toss-blue">{formatDuration(totalDuration)}</p>
        </div>
      </div>

      <div className="bg-toss-blueLight/50 border border-toss-blue/20 rounded-2xl p-5 mb-8">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-toss-gray500">1차 난이도</span>
            <p className="font-bold text-toss-dark">{exam.difficulty1}단계</p>
          </div>
          {exam.difficulty2 && (
            <div>
              <span className="text-toss-gray500">2차 난이도</span>
              <p className="font-bold text-toss-dark">{exam.difficulty2}단계</p>
            </div>
          )}
          {exam.targetLevel && (
            <div>
              <span className="text-toss-gray500">목표 등급</span>
              <p className="font-bold text-toss-blue">{exam.targetLevel}</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {questions.map((q, i) => {
          const answer = answerMap[i]
          return (
            <div key={i} className="border border-toss-gray100 rounded-2xl p-5 hover:border-toss-gray200 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-toss-gray500 w-6">Q{i + 1}</span>
                <span className="text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full font-semibold">{q.category}</span>
                <span className="text-xs px-2 py-0.5 bg-toss-gray100 text-toss-gray600 rounded-full">{q.session === 1 ? '1차' : '2차'}</span>
                {answer?.duration && (
                  <span className="ml-auto text-xs text-toss-gray500 flex items-center gap-1">
                    <Icon icon="solar:clock-circle-bold" className="text-sm" />
                    {formatDuration(answer.duration)}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-toss-dark mb-3">{q.content}</p>
              {answer?.audioUrl ? (
                <audio controls src={answer.audioUrl} className="w-full h-9" />
              ) : (
                <p className="text-xs text-toss-gray400 italic">답변 없음</p>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-3">
        <Link href={`/exam/${exam.id}`} className="flex-1">
          <Button variant="secondary" fullWidth>
            <Icon icon="solar:restart-bold" className="mr-2" />
            다시 보기
          </Button>
        </Link>
        <Link href="/exam" className="flex-1">
          <Button fullWidth>
            <Icon icon="solar:add-circle-bold" className="mr-2" />
            새 모의고사
          </Button>
        </Link>
      </div>
    </div>
  )
}
