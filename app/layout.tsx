import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/lib/auth'
import MixpanelProvider from '@/components/providers/MixpanelProvider'

export const metadata: Metadata = {
  title: 'OPIc Example | AI 유사 기출문제 생성',
  description: 'AI를 활용한 유사 기출문제로 나만의 OPIc 예상 문제를 무료로 생성하세요.',
  keywords: 'OPIc, 오픽, 영어 말하기, 예상 문제, AI 유사 기출문제',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()

  return (
    <html lang="ko">
      <body>
        <SessionProvider session={session}>
          <MixpanelProvider>{children}</MixpanelProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
