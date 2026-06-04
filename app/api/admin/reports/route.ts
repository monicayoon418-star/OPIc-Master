import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const reports = await prisma.report.findMany({
    include: {
      reporter: { select: { id: true, nickname: true } },
      reported: { select: { id: true, nickname: true, deletedAt: true } },
      post: { select: { id: true, title: true, type: true, deletedAt: true } },
      comment: { select: { id: true, content: true, deletedAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data: reports })
}
