import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; commentId: string }> }
) {
  const { id, commentId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { reason } = await req.json()
  if (!reason) return NextResponse.json({ error: 'Reason required' }, { status: 400 })

  const comment = await prisma.comment.findUnique({
    where: { id: commentId, postId: id, deletedAt: null },
  })
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (comment.userId === session.user.id)
    return NextResponse.json({ error: 'Cannot report own comment' }, { status: 400 })

  await prisma.report.create({
    data: {
      reporterId: session.user.id,
      reportedId: comment.userId,
      postId: id,
      commentId,
      reason,
    },
  })

  return NextResponse.json({ ok: true })
}
