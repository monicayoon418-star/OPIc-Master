import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function requireAdmin() {
  const session = await auth()
  return session?.user?.role === 'ADMIN' ? session : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const combos = await prisma.questionCombo.findMany({
    include: {
      questions: { orderBy: { comboOrder: 'asc' }, select: { id: true, content: true, category: true, difficulty: true, comboOrder: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ data: combos })
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { name, keyword } = await req.json()
  if (!name || !keyword) return NextResponse.json({ error: 'name and keyword required' }, { status: 400 })
  const combo = await prisma.questionCombo.create({ data: { name, keyword } })
  return NextResponse.json(combo)
}
