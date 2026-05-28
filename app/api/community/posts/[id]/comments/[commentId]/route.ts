import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; commentId: string }> }) {
  const { commentId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const comment = await prisma.comment.findUnique({ where: { id: commentId } })
  if (!comment) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (comment.userId !== session.user.id && session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await prisma.comment.update({ where: { id: commentId }, data: { deletedAt: new Date() } })
  return NextResponse.json({ ok: true })
}
