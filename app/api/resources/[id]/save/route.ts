import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.savedItem.upsert({
    where: { userId_resourceId: { userId: session.user.id, resourceId: id } },
    create: { userId: session.user.id, resourceId: id },
    update: {},
  })

  return NextResponse.json({ saved: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await prisma.savedItem.deleteMany({
    where: { userId: session.user.id, resourceId: id },
  })

  return NextResponse.json({ saved: false })
}
