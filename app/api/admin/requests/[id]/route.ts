import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { response } = await req.json()
  const updated = await prisma.request.update({
    where: { id: params.id },
    data: { response, status: 'ANSWERED', respondedAt: new Date() },
  })
  return NextResponse.json(updated)
}
