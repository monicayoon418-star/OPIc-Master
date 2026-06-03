import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const set = await prisma.generatedSet.findUnique({ where: { id: examId } })
  if (!set || set.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(set)
}
