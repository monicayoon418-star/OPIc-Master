import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import type { ExamKeywords } from '@/types'

type DBQuestion = {
  id: string; content: string; category: string; difficulty: number[]
  keywords: string[]; comboId: string | null; comboOrder: number | null
  positionStart: number | null; positionEnd: number | null
}

type FlatQuestion = { content: string; category: string }

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
): FlatQuestion[] {
  const result: FlatQuestion[] = []

  for (const unit of units) {
    if (result.length >= targetCount) break
    if (unit.some(q => usedIds.has(q.id))) continue

    const remaining = targetCount - result.length
    const slice = unit.slice(0, Math.min(unit.length, remaining))
    slice.forEach(q => {
      usedIds.add(q.id)
      result.push({ content: q.content, category: q.category })
    })
  }

  return result
}

// 위치 고정 문제를 순서에 맞게 삽입
function applyPositionPins(
  base: FlatQuestion[],
  pins: { questions: FlatQuestion[]; posStart: number; posEnd: number }[]
): FlatQuestion[] {
  if (pins.length === 0) return base

  // posStart 오름차순 정렬
  const sorted = [...pins].sort((a, b) => a.posStart - b.posStart)
  const result = [...base]

  let offset = 0
  for (const { questions: pqs, posStart, posEnd } of sorted) {
    // posStart~posEnd 범위 내 랜덤 위치 (1-indexed → 0-indexed)
    const range = posEnd - posStart
    const targetIdx = posStart - 1 + (range > 0 ? Math.floor(Math.random() * (range + 1)) : 0) + offset
    const clampedIdx = Math.max(0, Math.min(targetIdx, result.length))
    result.splice(clampedIdx, 0, ...pqs)
    offset += pqs.length
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
    const totalCount = session1Count + session2Count

    const allActive = await prisma.question.findMany({ where: { isActive: true } }) as DBQuestion[]

    // 위치 고정 문제 분리
    const pinnedRaw = allActive.filter(q => q.positionStart != null)

    // 콤보 단위로 묶기: comboId가 있으면 해당 콤보 전체가 핀 단위
    const pinnedUnitMap = new Map<string, { questions: DBQuestion[]; posStart: number; posEnd: number }>()
    const pinnedStandalone: { questions: DBQuestion[]; posStart: number; posEnd: number }[] = []

    for (const q of pinnedRaw) {
      if (q.comboId) {
        if (!pinnedUnitMap.has(q.comboId)) {
          const comboQs = allActive
            .filter(aq => aq.comboId === q.comboId)
            .sort((a, b) => (a.comboOrder ?? 0) - (b.comboOrder ?? 0))
          pinnedUnitMap.set(q.comboId, {
            questions: comboQs,
            posStart: q.positionStart!,
            posEnd: q.positionEnd ?? q.positionStart!,
          })
        }
      } else {
        pinnedStandalone.push({
          questions: [q],
          posStart: q.positionStart!,
          posEnd: q.positionEnd ?? q.positionStart!,
        })
      }
    }

    const pinnedUnits: { questions: DBQuestion[]; posStart: number; posEnd: number }[] = [
      ...Array.from(pinnedUnitMap.values()),
      ...pinnedStandalone,
    ]

    const pinnedCount = pinnedUnits.reduce((sum, u) => sum + u.questions.length, 0)
    const remainingCount = Math.max(0, totalCount - pinnedCount)

    // 핀 고정 문제 ID 집합 (랜덤 풀에서 제외)
    const pinnedIds = new Set(pinnedUnits.flatMap(u => u.questions.map(q => q.id)))
    const randomPool = allActive.filter(q => !pinnedIds.has(q.id)) as DBQuestion[]

    const userKeywords = [
      ...(keywords.leisure ?? []),
      ...(keywords.hobbies ?? []),
      ...(keywords.sports ?? []),
      ...(keywords.vacation ?? []),
    ].filter(Boolean)

    const shuffle = <T>(arr: T[]) => [...arr].sort(() => Math.random() - 0.5)
    const usedIds = new Set<string>()

    // 키워드 매칭 우선, 부족 시 전체 풀로 보충
    const s1MatchPool = userKeywords.length > 0
      ? randomPool.filter(q => q.difficulty.includes(session1Diff) && q.keywords.some(k => userKeywords.includes(k)))
      : []
    const s2MatchPool = userKeywords.length > 0
      ? randomPool.filter(q => q.difficulty.includes(session2Diff) && q.keywords.some(k => userKeywords.includes(k)))
      : []

    const s1Count = Math.ceil(remainingCount * (session1Count / totalCount))
    const s2Count = remainingCount - s1Count

    const s1Units = shuffle(buildComboUnits(shuffle(s1MatchPool) as DBQuestion[]))
    const s1Questions = fillSession(s1Units as DBQuestion[][], s1Count, usedIds)

    if (s1Questions.length < s1Count) {
      const fallback = shuffle(buildComboUnits(randomPool.filter(q => !usedIds.has(q.id)) as DBQuestion[]))
      s1Questions.push(...fillSession(fallback as DBQuestion[][], s1Count - s1Questions.length, usedIds))
    }

    const s2Units = shuffle(buildComboUnits(shuffle(s2MatchPool) as DBQuestion[]))
    const s2Questions = fillSession(s2Units as DBQuestion[][], s2Count, usedIds)

    if (s2Questions.length < s2Count) {
      const fallback = shuffle(buildComboUnits(randomPool.filter(q => !usedIds.has(q.id)) as DBQuestion[]))
      s2Questions.push(...fillSession(fallback as DBQuestion[][], s2Count - s2Questions.length, usedIds))
    }

    const randomQuestions = [...s1Questions, ...s2Questions]

    // 핀 단위를 지정 위치에 삽입
    const flatPins = pinnedUnits.map(u => ({
      questions: u.questions.map(q => ({ content: q.content, category: q.category })),
      posStart: u.posStart,
      posEnd: u.posEnd,
    }))

    const finalList = applyPositionPins(randomQuestions, flatPins)

    if (finalList.length === 0) {
      return NextResponse.json({ error: '기출 문제 데이터가 없습니다. 관리자에게 문의해주세요.' }, { status: 400 })
    }

    // 세션 재분배: 앞 session1Count개는 세션1, 나머지는 세션2
    const questions = finalList.map((q, i) => ({
      id: `q_${i}`,
      content: q.content,
      category: q.category,
      session: i < session1Count ? 1 as const : 2 as const,
    }))

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
