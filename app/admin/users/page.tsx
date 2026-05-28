import { prisma } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import DeleteUserButton from './DeleteUserButton'

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const pageSize = 30

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: { deletedAt: null },
      include: { _count: { select: { exams: true, posts: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.user.count({ where: { deletedAt: null } }),
  ])

  const JOB_LABELS: Record<string, string> = { STUDENT: '대학생', GRADUATE_STUDENT: '대학원생', JOB_SEEKER: '취준생', EMPLOYEE: '직장인' }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-toss-dark">사용자 관리</h1>
        <p className="text-sm text-toss-gray500">총 {total}명</p>
      </div>

      <div className="bg-white rounded-2xl border border-toss-gray100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-toss-gray50 text-toss-gray600">
              <th className="text-left px-5 py-3 font-semibold">닉네임</th>
              <th className="text-left px-4 py-3 font-semibold">이메일</th>
              <th className="text-left px-4 py-3 font-semibold w-24">직업</th>
              <th className="text-center px-4 py-3 font-semibold w-20">시험</th>
              <th className="text-center px-4 py-3 font-semibold w-20">게시글</th>
              <th className="text-left px-4 py-3 font-semibold w-32">가입일</th>
              <th className="w-20 px-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-toss-gray100">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-toss-gray50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-toss-dark">{user.nickname}</span>
                    {user.role === 'ADMIN' && <span className="text-xs px-1.5 py-0.5 bg-toss-blue text-white rounded-md font-bold">관리자</span>}
                  </div>
                </td>
                <td className="px-4 py-3 text-toss-gray600">{user.email ?? '-'}</td>
                <td className="px-4 py-3 text-toss-gray600">{user.job ? JOB_LABELS[user.job] : '-'}</td>
                <td className="px-4 py-3 text-center text-toss-gray700">{user._count.exams}</td>
                <td className="px-4 py-3 text-center text-toss-gray700">{user._count.posts}</td>
                <td className="px-4 py-3 text-toss-gray500">{formatDate(user.createdAt.toISOString())}</td>
                <td className="px-4 py-3">
                  {user.role !== 'ADMIN' && <DeleteUserButton userId={user.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
