import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'

export default async function MyPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      _count: { select: { exams: true, posts: true, savedItems: true } },
    },
  })

  if (!user) redirect('/login')

  const recentExams = await prisma.exam.findMany({
    where: { userId: user.id, status: 'COMPLETED' },
    orderBy: { createdAt: 'desc' },
    take: 3,
  })

  const JOB_LABELS: Record<string, string> = {
    STUDENT: '대학생', GRADUATE_STUDENT: '대학원생', JOB_SEEKER: '취준생', EMPLOYEE: '직장인'
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-toss-dark mb-8">마이페이지</h1>

      {/* Profile */}
      <div className="bg-toss-gray50 rounded-3xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-toss-blue/10 rounded-full flex items-center justify-center">
            <Icon icon="solar:user-bold-duotone" className="text-2xl text-toss-blue" />
          </div>
          <div>
            <p className="text-lg font-bold text-toss-dark">{user.nickname}</p>
            <p className="text-sm text-toss-gray500">{user.email ?? '카카오 로그인'}</p>
            {user.job && <span className="text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full font-medium">{JOB_LABELS[user.job]}</span>}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-toss-dark">{user._count.exams}</p>
            <p className="text-xs text-toss-gray500">응시한 시험</p>
          </div>
          <div>
            <p className="text-xl font-bold text-toss-dark">{user._count.posts}</p>
            <p className="text-xs text-toss-gray500">작성한 글</p>
          </div>
          <div>
            <p className="text-xl font-bold text-toss-dark">{user._count.savedItems}</p>
            <p className="text-xs text-toss-gray500">저장한 글</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { href: '/mypage/history', icon: 'solar:history-bold-duotone', label: '시험 내역', color: 'text-toss-blue' },
          { href: '/mypage/saved', icon: 'solar:bookmark-bold-duotone', label: '저장한 글', color: 'text-toss-green' },
          { href: '/mypage/requests', icon: 'solar:chat-square-bold-duotone', label: '요청사항', color: 'text-purple-500' },
          { href: '/mypage/account', icon: 'solar:settings-bold-duotone', label: '계정 설정', color: 'text-toss-gray600' },
        ].map(item => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 hover:shadow-sm transition-all">
            <Icon icon={item.icon} className={`text-2xl ${item.color}`} />
            <span className="font-semibold text-toss-dark text-sm">{item.label}</span>
            <Icon icon="solar:arrow-right-linear" className="ml-auto text-toss-gray400" />
          </Link>
        ))}
      </div>

      {/* Recent Exams */}
      {recentExams.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-toss-dark">최근 시험</h2>
            <Link href="/mypage/history" className="text-sm text-toss-blue hover:underline">전체 보기</Link>
          </div>
          <div className="space-y-2">
            {recentExams.map(exam => (
              <Link key={exam.id} href={`/exam/result/${exam.id}`} className="flex items-center justify-between p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 transition-colors">
                <div className="flex items-center gap-3">
                  <Icon icon="solar:document-bold-duotone" className="text-xl text-toss-blue" />
                  <div>
                    <p className="text-sm font-semibold text-toss-dark">난이도 {exam.difficulty1}단계 모의고사</p>
                    <p className="text-xs text-toss-gray500">{formatDate(exam.createdAt.toISOString())}</p>
                  </div>
                </div>
                <Icon icon="solar:arrow-right-linear" className="text-toss-gray400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
