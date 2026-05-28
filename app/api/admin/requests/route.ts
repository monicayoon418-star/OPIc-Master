import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const data = await prisma.request.findMany({
    include: { user: { select: { nickname: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ data })
}
