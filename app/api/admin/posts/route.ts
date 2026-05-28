import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const data = await prisma.post.findMany({
    where: { deletedAt: null },
    include: { user: { select: { nickname: true } }, _count: { select: { comments: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ data })
}
