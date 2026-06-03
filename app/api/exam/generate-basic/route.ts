import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { difficulty1, difficulty2, targetLevel, keywords } = await req.json()

    const session1Count = 7
    const session2Count = (difficulty2 ?? difficulty1) <= 2 ? 5 : 8

    const allQuestions = await prisma.question.findMany({ where: { isActive: true } })

    if (allQuestions.length === 0) {
      return NextResponse.json({ error: '기출 문제 데이터가 없습니다. 관리자에게 문의해주세요.' }, { status: 400 })
    }

    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5)

    const pick = (count: number, offset: number) =>
      Array.from({ length: count }, (_, i) => shuffled[(offset + i) % shuffled.length])

    const s1 = pick(session1Count, 0).map((q, i) => ({
      id: `q_${i}`,
      content: q.content,
      category: q.category,
      session: 1 as const,
    }))

    const s2 = pick(session2Count, session1Count).map((q, i) => ({
      id: `q_${session1Count + i}`,
      content: q.content,
      category: q.category,
      session: 2 as const,
    }))

    const questions = [...s1, ...s2]

    const generatedSet = await prisma.generatedSet.create({
      data: {
        userId: session.user.id,
        difficulty1,
        difficulty2: difficulty2 ?? null,
        targetLevel: targetLevel ?? 'IH',
        keywords,
        questions,
      },
    })

    return NextResponse.json({ setId: generatedSet.id, questions, isBasic: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error('[generate-basic] error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
