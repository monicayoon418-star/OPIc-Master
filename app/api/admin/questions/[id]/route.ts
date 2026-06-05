import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function requireAdmin() {
  const session = await auth()
  return session?.user?.role === 'ADMIN' ? session : null
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { content, category, difficulty, keywords, comboId, comboOrder, positionStart, positionEnd } = await req.json()
  const q = await prisma.question.update({
    where: { id },
    data: {
      content,
      category,
      difficulty: Array.isArray(difficulty) ? difficulty : [difficulty],
      keywords,
      comboId: comboId ?? null,
      comboOrder: comboOrder ?? null,
      positionStart: positionStart ?? null,
      positionEnd: positionEnd ?? null,
    },
    include: { combo: { select: { id: true, name: true, keyword: true } } },
  })
  return NextResponse.json(q)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  await prisma.question.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
