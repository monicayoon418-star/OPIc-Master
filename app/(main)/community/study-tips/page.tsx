import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import PostCard from '@/components/community/PostCard'
import { auth } from '@/lib/auth'

export default async function StudyTipsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const pageSize = 20
  const session = await auth()

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { type: 'STUDY', deletedAt: null },
      include: { user: { select: { id: true, nickname: true } }, _count: { select: { comments: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where: { type: 'STUDY', deletedAt: null } }),
  ])

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-toss-dark">문제생성 후기</h1>
          <p className="text-sm text-toss-gray500 mt-1">총 {total}개의 게시글</p>
        </div>
        {session && (
          <Link href="/community/study-tips/new" className="flex items-center gap-1.5 bg-toss-blue text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-toss-blueHover transition-colors">
            <Icon icon="solar:pen-bold" />
            글쓰기
          </Link>
        )}
      </div>

      <div className="bg-white border border-toss-gray100 rounded-2xl overflow-hidden">
        {posts.length === 0 ? (
          <div className="py-16 text-center text-toss-gray400">
            <Icon icon="solar:lightbulb-bold-duotone" className="text-4xl mx-auto mb-3 block" />
            <p>첫 번째 문제생성 후기를 작성해보세요!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard key={post.id} post={post as any} href={`/community/study-tips/${post.id}`} />
          ))
        )}
      </div>
    </div>
  )
}
