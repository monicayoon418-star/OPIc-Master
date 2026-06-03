import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const set = await prisma.generatedSet.findUnique({ where: { id: examId } })
  if (!set || set.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const saved = await prisma.savedItem.upsert({
    where: { userId_generatedSetId: { userId: session.user.id, generatedSetId: examId } },
    create: { userId: session.user.id, generatedSetId: examId },
    update: {},
  })

  return NextResponse.json({ saved: true, id: saved.id })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.savedItem.deleteMany({
    where: { userId: session.user.id, generatedSetId: examId },
  })

  return NextResponse.json({ saved: false })
}
