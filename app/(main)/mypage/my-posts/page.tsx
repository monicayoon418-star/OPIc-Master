import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'

export default async function MyPostsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const posts = await prisma.post.findMany({
    where: { userId: session.user.id, deletedAt: null },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/mypage" className="text-toss-gray500 hover:text-toss-dark">
          <Icon icon="solar:arrow-left-linear" />
        </Link>
        <h1 className="text-2xl font-bold text-toss-dark">내가 쓴 글</h1>
      </div>

      {posts.length === 0 ? (
        <div className="py-20 text-center text-toss-gray400">
          <Icon icon="solar:pen-bold-duotone" className="text-5xl mx-auto mb-4 block" />
          <p className="font-semibold mb-2">작성한 글이 없습니다</p>
          <Link href="/community" className="text-sm text-toss-blue hover:underline">후기 작성하러 가기</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {posts.map(post => {
            const href = post.type === 'REVIEW' ? `/community/reviews/${post.id}` : `/community/study-tips/${post.id}`
            return (
              <Link key={post.id} href={href} className="flex items-center gap-4 p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      post.type === 'REVIEW' ? 'bg-toss-blueLight text-toss-blue' : 'bg-green-100 text-toss-green'
                    }`}>
                      {post.type === 'REVIEW' ? '시험 후기' : '공부꿀팁'}
                    </span>
                  </div>
                  <p className="font-semibold text-sm text-toss-dark truncate">{post.title}</p>
                  <p className="text-xs text-toss-gray500 mt-0.5">{formatDate(post.createdAt.toISOString())}</p>
                </div>
                <Icon icon="solar:arrow-right-linear" className="text-toss-gray400 flex-shrink-0" />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
