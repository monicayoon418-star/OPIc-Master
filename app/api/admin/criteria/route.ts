import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function requireAdmin() {
  const session = await auth()
  return session?.user?.role === 'ADMIN' ? session : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const criteria = await prisma.examGenerationCriteria.findFirst({ orderBy: { updatedAt: 'desc' } })
  return NextResponse.json({ content: criteria?.content ?? '' })
}

export async function PUT(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { content } = await req.json()
  const existing = await prisma.examGenerationCriteria.findFirst()
  if (existing) {
    await prisma.examGenerationCriteria.update({ where: { id: existing.id }, data: { content } })
  } else {
    await prisma.examGenerationCriteria.create({ data: { content } })
  }
  return NextResponse.json({ ok: true })
}
