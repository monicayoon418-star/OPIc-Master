import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { examId: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionIndex, audioKey, duration } = await req.json()

  await prisma.examAnswer.upsert({
    where: { examId_questionIndex: { examId: params.examId, questionIndex } },
    create: { examId: params.examId, questionIndex, audioKey, duration },
    update: { audioKey, duration },
  })

  return NextResponse.json({ ok: true })
}
