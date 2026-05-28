import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.exam.update({
    where: { id: examId },
    data: { status: 'COMPLETED', endedAt: new Date() },
  })

  return NextResponse.json({ ok: true })
}
