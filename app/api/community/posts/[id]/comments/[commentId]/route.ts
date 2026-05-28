import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string; commentId: string } }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const comment = await prisma.comment.findUnique({ where: { id: params.commentId } })
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (comment.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.comment.update({ where: { id: params.commentId }, data: { deletedAt: new Date() } })
  return NextResponse.json({ ok: true })
}
