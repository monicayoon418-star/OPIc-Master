import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { content } = await req.json()
  if (!content?.trim()) return NextResponse.json({ error: 'Missing content' }, { status: 400 })

  const comment = await prisma.comment.create({
    data: { postId: params.id, userId: session.user.id, content: content.trim() },
    include: { user: { select: { id: true, nickname: true } } },
  })

  return NextResponse.json(comment)
}
