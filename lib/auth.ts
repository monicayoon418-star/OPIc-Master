import NextAuth from 'next-auth'
import KakaoProvider from 'next-auth/providers/kakao'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })
        if (!user || !user.password) return null
        const { default: bcrypt } = await import('bcryptjs')
        const valid = await bcrypt.compare(credentials.password as string, user.password)
        if (!valid) return null
        return { id: user.id, email: user.email, name: user.nickname, role: user.role }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'kakao') {
        const existing = await prisma.user.findUnique({
          where: { kakaoId: account.providerAccountId },
        })
        if (!existing) {
          await prisma.user.create({
            data: {
              kakaoId: account.providerAccountId,
              nickname: `user_${account.providerAccountId.slice(-6)}`,
              role: 'USER',
            },
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      if (account?.provider === 'kakao') {
        const dbUser = await prisma.user.findUnique({
          where: { kakaoId: account.providerAccountId },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.role = dbUser.role
          token.needsProfile = !dbUser.age
        }
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.needsProfile = token.needsProfile as boolean
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.AUTH_SECRET,
})
