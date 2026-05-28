import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'

export const metadata: Metadata = {
  title: 'OPIc Master | 단기 완성 솔루션',
  description: '실제 OPIc 시험 환경에서 AI 기반 모의고사를 무료로 체험하세요.',
  keywords: 'OPIc, 오픽, 영어 말하기, 모의고사, AI 학습',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="ko">
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  )
}
