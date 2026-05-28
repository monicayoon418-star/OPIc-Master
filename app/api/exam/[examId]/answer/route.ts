import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionIndex, audioKey, duration } = await req.json()

  await prisma.examAnswer.upsert({
    where: { examId_questionIndex: { examId, questionIndex } },
    create: { examId, questionIndex, audioKey, duration },
    update: { audioKey, duration },
  })

  return NextResponse.json({ ok: true })
}
