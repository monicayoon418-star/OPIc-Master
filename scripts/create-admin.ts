import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]
  const nickname = process.argv[4] ?? '관리자'

  if (!email || !password) {
    console.error('사용법: npx ts-node scripts/create-admin.ts <이메일> <비밀번호> [닉네임]')
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    })
    console.log(`✅ 기존 계정(${email})을 어드민으로 승격했습니다.`)
    return
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { email, password: hashed, nickname, role: 'ADMIN' },
  })
  console.log(`✅ 어드민 계정 생성 완료: ${user.email} (닉네임: ${user.nickname})`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
