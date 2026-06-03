import { prisma } from '@/lib/db'
import { Icon } from '@iconify/react'
import StatsChart from '@/components/admin/StatsChart'

async function getStats() {
  const [totalUsers, totalGeneratedSets, totalPosts, pendingRequests] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.generatedSet.count(),
    prisma.post.count({ where: { deletedAt: null } }),
    prisma.request.count({ where: { status: 'PENDING' } }),
  ])

  const now = new Date()
  const dailyData = await Promise.all(
    Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now)
      date.setDate(date.getDate() - (6 - i))
      const start = new Date(date.setHours(0, 0, 0, 0))
      const end = new Date(date.setHours(23, 59, 59, 999))
      return prisma.user.count({ where: { createdAt: { gte: start, lte: end }, deletedAt: null } })
        .then(count => ({ date: start.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }), count }))
    })
  )

  return { totalUsers, totalGeneratedSets, totalPosts, pendingRequests, dailyData }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold text-toss-dark mb-8">대시보드</h1>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { icon: 'solar:users-group-rounded-bold-duotone', color: 'text-toss-blue bg-toss-blueLight', label: '전체 사용자', value: stats.totalUsers.toLocaleString() },
          { icon: 'solar:document-bold-duotone', color: 'text-toss-green bg-green-100', label: '생성된 문제 세트', value: stats.totalGeneratedSets.toLocaleString() },
          { icon: 'solar:chat-square-bold-duotone', color: 'text-purple-500 bg-purple-100', label: '총 게시글', value: stats.totalPosts.toLocaleString() },
          { icon: 'solar:letter-bold-duotone', color: 'text-toss-yellow bg-yellow-100', label: '미처리 요청', value: stats.pendingRequests.toString() },
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-toss-gray100 p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${item.color}`}>
              <Icon icon={item.icon} className="text-xl" />
            </div>
            <p className="text-2xl font-bold text-toss-dark">{item.value}</p>
            <p className="text-sm text-toss-gray500 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-toss-gray100 p-6">
        <h2 className="font-bold text-toss-dark mb-4">최근 7일 가입자 추이</h2>
        <StatsChart data={stats.dailyData} />
      </div>
    </div>
  )
}
