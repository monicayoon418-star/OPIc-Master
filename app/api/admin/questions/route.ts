import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

async function requireAdmin() {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') return null
  return session
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const data = await prisma.question.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { content, category, difficulty, keywords } = await req.json()
  const q = await prisma.question.create({ data: { content, category, difficulty, keywords: keywords ?? [] } })
  return NextResponse.json(q)
}
