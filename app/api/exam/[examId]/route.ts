import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(_req: NextRequest, { params }: { params: { examId: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const exam = await prisma.exam.findUnique({ where: { id: params.examId } })
  if (!exam || exam.userId !== session.user.id) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  return NextResponse.json(exam)
}
