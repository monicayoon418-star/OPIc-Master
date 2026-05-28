import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const { email, password, nickname, age, job } = await req.json()

  if (!email || !password || !nickname) {
    return NextResponse.json({ error: '필수 항목을 입력해주세요.' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: '비밀번호는 6자 이상이어야 합니다.' }, { status: 400 })
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { nickname }] },
  })

  if (existing) {
    const field = existing.email === email ? '이메일' : '닉네임'
    return NextResponse.json({ error: `이미 사용 중인 ${field}입니다.` }, { status: 409 })
  }

  const { default: bcrypt } = await import('bcryptjs')
  const hashed = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      nickname,
      age: age ?? null,
      job: job ?? null,
    },
  })

  return NextResponse.json({ id: user.id, nickname: user.nickname })
}
