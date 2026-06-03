import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await prisma.savedItem.findMany({
    where: { userId: session.user.id, resourceId: { not: null } },
    include: {
      resource: {
        select: { id: true, title: true, thumbnailUrl: true, youtubeUrl: true, tags: true, createdAt: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ data })
}
