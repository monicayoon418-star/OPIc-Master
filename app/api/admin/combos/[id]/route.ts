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
  const { name, keyword } = await req.json()
  const combo = await prisma.questionCombo.update({ where: { id }, data: { name, keyword } })
  return NextResponse.json(combo)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  // combo 삭제 시 소속 문제들의 comboId/comboOrder를 null로 초기화
  await prisma.question.updateMany({ where: { comboId: id }, data: { comboId: null, comboOrder: null } })
  await prisma.questionCombo.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
