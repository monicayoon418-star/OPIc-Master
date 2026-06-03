import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { title, content, type } = await req.json()
  if (!title?.trim() || !content?.trim() || !type) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

  const post = await prisma.post.create({
    data: { userId: session.user.id, title: title.trim(), content: content.trim(), type },
  })

  return NextResponse.json(post)
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') as 'REVIEW' | 'STUDY' | null
  const page = Number(searchParams.get('page') ?? 1)
  const pageSize = 20

  const where = { ...(type ? { type } : {}), deletedAt: null }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { user: { select: { id: true, nickname: true } }, _count: { select: { comments: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ])

  return NextResponse.json({ data: posts, total, page, pageSize, hasMore: page * pageSize < total })
}
