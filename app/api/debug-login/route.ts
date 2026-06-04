import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const steps: Record<string, unknown> = {}

  try {
    // 1. DB 연결 + 유저 조회
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, password: true, role: true, deletedAt: true }
    })
    steps.userFound = !!user
    steps.userRole = user?.role
    steps.deletedAt = user?.deletedAt
    steps.hasPasswordHash = !!user?.password
    steps.hashPrefix = user?.password?.slice(0, 10)

    if (!user || !user.password) {
      return NextResponse.json({ ok: false, steps, reason: 'user_not_found_or_no_password' })
    }

    // 2. bcrypt 비교
    const valid = await bcrypt.compare(password, user.password)
    steps.bcryptValid = valid

    return NextResponse.json({ ok: valid, steps, reason: valid ? 'success' : 'wrong_password' })
  } catch (e) {
    return NextResponse.json({ ok: false, steps, error: String(e) })
  }
}
