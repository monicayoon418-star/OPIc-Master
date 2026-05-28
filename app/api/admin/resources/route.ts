import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getYoutubeThumbnail } from '@/lib/utils'

async function requireAdmin() {
  const session = await auth()
  return session?.user?.role === 'ADMIN' ? session : null
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const data = await prisma.resource.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  const { title, youtubeUrl, description, tags } = await req.json()
  const thumbnailUrl = getYoutubeThumbnail(youtubeUrl)
  const r = await prisma.resource.create({ data: { title, youtubeUrl, description, tags, thumbnailUrl } })
  return NextResponse.json(r)
}
