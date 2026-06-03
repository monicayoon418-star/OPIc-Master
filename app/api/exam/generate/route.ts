import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { generateExamQuestions } from '@/lib/claude'

export const maxDuration = 60

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { difficulty1, difficulty2, targetLevel, keywords } = await req.json()

    const criteria = await prisma.examGenerationCriteria.findFirst({ orderBy: { updatedAt: 'desc' } })
    const actualQuestions = await prisma.question.findMany({ where: { isActive: true }, take: 50 })

    const questions = await generateExamQuestions({
      difficulty1,
      difficulty2: difficulty2 ?? difficulty1,
      targetLevel: targetLevel ?? 'IH',
      keywords,
      criteria: criteria?.content ?? '실제 OPIc 시험 형식에 맞게 자연스러운 한국어로 질문을 생성하세요.',
      actualQuestions,
    })

    const generatedSet = await prisma.generatedSet.create({
      data: {
        userId: session.user.id,
        difficulty1,
        difficulty2: difficulty2 ?? null,
        targetLevel: targetLevel ?? 'IH',
        keywords,
        questions: questions.map((q, i) => ({ ...q, id: `q_${i}` })),
      },
    })

    return NextResponse.json({ setId: generatedSet.id, questions })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[generate] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
