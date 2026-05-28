import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const randomSuffix = Math.random().toString(36).slice(2, 8)
  await prisma.user.update({
    where: { id: params.id },
    data: {
      email: `deleted_${randomSuffix}@removed.local`,
      nickname: `탈퇴회원_${randomSuffix}`,
      deletedAt: new Date(),
    },
  })

  return NextResponse.json({ ok: true })
}
