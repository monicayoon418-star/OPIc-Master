import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import PostCard, { PostTableHeader } from '@/components/community/PostCard'
import { auth } from '@/lib/auth'

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const pageSize = 20
  const session = await auth()

  const [pinnedPosts, posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { type: 'REVIEW', deletedAt: null, isPinned: true },
      include: { user: { select: { id: true, nickname: true } }, _count: { select: { comments: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.post.findMany({
      where: { type: 'REVIEW', deletedAt: null, isPinned: false },
      include: { user: { select: { id: true, nickname: true } }, _count: { select: { comments: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where: { type: 'REVIEW', deletedAt: null, isPinned: false } }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-toss-dark">시험 후기</h1>
          <p className="text-sm text-toss-gray500 mt-1">총 {total}개의 후기</p>
        </div>
        {session && (
          <Link href="/community/reviews/new" className="flex items-center gap-1.5 bg-toss-blue text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-toss-blueHover transition-colors">
            <Icon icon="solar:pen-bold" />
            글쓰기
          </Link>
        )}
      </div>

      <div className="bg-white border border-toss-gray200 rounded-xl overflow-hidden mb-6">
        <PostTableHeader />

        {pinnedPosts.length === 0 && posts.length === 0 ? (
          <div className="py-16 text-center text-toss-gray400 text-sm">
            아직 작성된 후기가 없습니다.
          </div>
        ) : (
          <>
            {pinnedPosts.map(post => (
              <PostCard key={post.id} post={post as any} href={`/community/reviews/${post.id}`} />
            ))}
            {posts.map((post, i) => (
              <PostCard
                key={post.id}
                post={post as any}
                href={`/community/reviews/${post.id}`}
                rowNumber={total - ((page - 1) * pageSize + i)}
              />
            ))}
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={`/community/reviews?page=${p}`}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-semibold transition-colors ${p === page ? 'bg-toss-blue text-white' : 'text-toss-gray600 hover:bg-toss-gray100'}`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
