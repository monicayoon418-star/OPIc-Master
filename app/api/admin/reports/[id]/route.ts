import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

// action: 'dismiss' | 'delete_content' | 'delete_and_ban'
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { action } = await req.json()

  const report = await prisma.report.findUnique({ where: { id } })
  if (!report) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  if (action === 'delete_content' || action === 'delete_and_ban') {
    if (report.commentId) {
      await prisma.comment.update({ where: { id: report.commentId }, data: { deletedAt: new Date() } })
    } else if (report.postId) {
      await prisma.post.update({ where: { id: report.postId }, data: { deletedAt: new Date() } })
    }
  }

  if (action === 'delete_and_ban') {
    const suffix = Math.random().toString(36).slice(2, 8)
    await prisma.user.update({
      where: { id: report.reportedId },
      data: {
        email: `deleted_${suffix}@removed.local`,
        nickname: `탈퇴회원_${suffix}`,
        deletedAt: new Date(),
      },
    })
  }

  await prisma.report.update({ where: { id }, data: { handled: true } })

  return NextResponse.json({ ok: true })
}
