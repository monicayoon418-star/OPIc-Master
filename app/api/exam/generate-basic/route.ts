import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { ExamKeywords } from '@/types'

type DBQuestion = {
  id: string; content: string; category: string; difficulty: number[]
  keywords: string[]; comboId: string | null; comboOrder: number | null
}

function buildComboUnits(questions: DBQuestion[]) {
  const comboMap = new Map<string, DBQuestion[]>()
  const dolbalPool: DBQuestion[] = []
  const standalone: DBQuestion[] = []

  for (const q of questions) {
    if (q.category === '돌발') {
      dolbalPool.push(q)
    } else if (q.comboId) {
      const group = comboMap.get(q.comboId) ?? []
      group.push(q)
      comboMap.set(q.comboId, group)
    } else {
      standalone.push(q)
    }
  }

  // 콤보 내 문제를 순서대로 정렬
  const comboUnits = Array.from(comboMap.values()).map(qs =>
    qs.sort((a, b) => (a.comboOrder ?? 0) - (b.comboOrder ?? 0))
  )

  // 돌발 문제: 2~3개씩 랜덤 묶음
  const dolbalUnits: DBQuestion[][] = []
  const shuffledDolbal = [...dolbalPool].sort(() => Math.random() - 0.5)
  let i = 0
  while (i < shuffledDolbal.length) {
    const groupSize = Math.random() < 0.5 ? 2 : 3
    dolbalUnits.push(shuffledDolbal.slice(i, i + groupSize))
    i += groupSize
  }

  return [...comboUnits, ...dolbalUnits, ...standalone.map(q => [q])]
}

function fillSession(
  units: DBQuestion[][],
  targetCount: number,
  usedIds: Set<string>
): { content: string; category: string; session: 1 | 2 }[] {
  const result: { content: string; category: string; session: 1 | 2 }[] = []

  for (const unit of units) {
    if (result.length >= targetCount) break
    if (unit.some(q => usedIds.has(q.id))) continue

    const remaining = targetCount - result.length
    const slice = unit.slice(0, Math.min(unit.length, remaining))
    slice.forEach(q => {
      usedIds.add(q.id)
      result.push({ content: q.content, category: q.category, session: 1 })
    })
  }

  return result
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { difficulty1, difficulty2, targetLevel, keywords } = await req.json() as {
      difficulty1: number; difficulty2?: number; targetLevel?: string; keywords: ExamKeywords
    }

    const session1Diff = difficulty1
    const session2Diff = difficulty2 ?? difficulty1
    const session1Count = 7
    const session2Count = session2Diff <= 2 ? 5 : 8

    const userKeywords = [
      ...(keywords.leisure ?? []),
      ...(keywords.hobbies ?? []),
      ...(keywords.sports ?? []),
      ...(keywords.vacation ?? []),
    ].filter(Boolean)

    // 세션1: 난이도 + 키워드 매칭 문제
    const s1Matching = userKeywords.length > 0
      ? await prisma.question.findMany({
          where: { isActive: true, difficulty: { has: session1Diff }, keywords: { hasSome: userKeywords } },
        })
      : []

    // 세션2: 난이도 + 키워드 매칭 문제
    const s2Matching = userKeywords.length > 0
      ? await prisma.question.findMany({
          where: { isActive: true, difficulty: { has: session2Diff }, keywords: { hasSome: userKeywords } },
        })
      : []

    // 전체 풀 (매칭 안 되는 보충용)
    const allActive = await prisma.question.findMany({ where: { isActive: true } })

    const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)

    const usedIds = new Set<string>()

    // 세션1 콤보 단위 구성 → 채우기
    const s1Units = shuffle(buildComboUnits(shuffle(s1Matching) as DBQuestion[]))
    const s1Questions = fillSession(s1Units as DBQuestion[][], session1Count, usedIds)

    // 세션1 부족분 보충 (난이도 무관)
    if (s1Questions.length < session1Count) {
      const fallbackUnits = shuffle(buildComboUnits(allActive.filter(q => !usedIds.has(q.id)) as DBQuestion[]))
      const extra = fillSession(fallbackUnits as DBQuestion[][], session1Count - s1Questions.length, usedIds)
      s1Questions.push(...extra)
    }

    // 세션2 콤보 단위 구성 → 채우기 (세션1과 중복 제외)
    const s2Units = shuffle(buildComboUnits(shuffle(s2Matching) as DBQuestion[]))
    const s2Questions = fillSession(s2Units as DBQuestion[][], session2Count, usedIds)

    // 세션2 부족분 보충
    if (s2Questions.length < session2Count) {
      const fallbackUnits = shuffle(buildComboUnits(allActive.filter(q => !usedIds.has(q.id)) as DBQuestion[]))
      const extra = fillSession(fallbackUnits as DBQuestion[][], session2Count - s2Questions.length, usedIds)
      s2Questions.push(...extra)
    }

    if (s1Questions.length + s2Questions.length === 0) {
      return NextResponse.json({ error: '기출 문제 데이터가 없습니다. 관리자에게 문의해주세요.' }, { status: 400 })
    }

    const questions = [
      ...s1Questions.map((q, i) => ({ id: `q_${i}`, ...q, session: 1 as const })),
      ...s2Questions.map((q, i) => ({ id: `q_${s1Questions.length + i}`, ...q, session: 2 as const })),
    ]

    const generatedSet = await prisma.generatedSet.create({
      data: {
        userId: session.user.id,
        difficulty1,
        difficulty2: difficulty2 ?? null,
        targetLevel: targetLevel ?? 'IH',
        keywords: keywords as object,
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
