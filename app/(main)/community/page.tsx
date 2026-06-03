import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import PostCard from '@/components/community/PostCard'
import WriteButton from './WriteButton'

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; sort?: string; page?: string }>
}) {
  const { type, sort, page: pageParam } = await searchParams
  const page = Number(pageParam ?? 1)
  const pageSize = 20
  const session = await auth()

  const typeFilter = type === 'REVIEW' ? 'REVIEW' : type === 'STUDY' ? 'STUDY' : undefined
  const order = sort === 'asc' ? 'asc' : 'desc'

  const where = { deletedAt: null, ...(typeFilter ? { type: typeFilter as any } : {}) }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { user: { select: { id: true, nickname: true } }, _count: { select: { comments: true } } },
      orderBy: { createdAt: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ])

  const totalPages = Math.ceil(total / pageSize)

  const buildUrl = (params: Record<string, string>) => {
    const p = new URLSearchParams()
    if (type) p.set('type', type)
    if (sort) p.set('sort', sort)
    Object.entries(params).forEach(([k, v]) => v ? p.set(k, v) : p.delete(k))
    const str = p.toString()
    return `/community${str ? `?${str}` : ''}`
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-toss-dark">시험 후기</h1>
          <p className="text-sm text-toss-gray500 mt-1">총 {total}개의 글</p>
        </div>
        {session && <WriteButton />}
      </div>

      {/* 필터 + 정렬 */}
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        {/* 타입 필터 */}
        <div className="flex gap-2">
          {[
            { label: '전체', value: '' },
            { label: '시험 후기', value: 'REVIEW' },
            { label: '문제생성 후기', value: 'STUDY' },
          ].map(item => (
            <Link
              key={item.value}
              href={buildUrl({ type: item.value, page: '1' })}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                (item.value === '' && !type) || type === item.value
                  ? 'bg-toss-blue text-white border-toss-blue'
                  : 'bg-white border-toss-gray200 text-toss-gray700 hover:border-toss-blue/50'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* 정렬 */}
        <div className="flex gap-2">
          {[
            { label: '최신순', value: 'desc' },
            { label: '오래된 순', value: 'asc' },
          ].map(item => (
            <Link
              key={item.value}
              href={buildUrl({ sort: item.value === 'desc' ? '' : item.value, page: '1' })}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                (item.value === 'desc' && !sort) || sort === item.value
                  ? 'bg-toss-dark text-white border-toss-dark'
                  : 'bg-white border-toss-gray200 text-toss-gray700 hover:border-toss-gray400'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {/* 게시글 목록 */}
      <div className="bg-white border border-toss-gray100 rounded-2xl overflow-hidden mb-6">
        {posts.length === 0 ? (
          <div className="py-16 text-center text-toss-gray400">
            <Icon icon="solar:document-add-bold-duotone" className="text-4xl mx-auto mb-3 block" />
            <p>아직 작성된 글이 없습니다.</p>
          </div>
        ) : (
          posts.map(post => {
            const href = post.type === 'REVIEW'
              ? `/community/reviews/${post.id}`
              : `/community/study-tips/${post.id}`
            return (
              <div key={post.id} className="relative">
                <span className={`absolute top-5 right-5 text-xs px-2 py-0.5 rounded-full font-semibold ${
                  post.type === 'REVIEW' ? 'bg-toss-blueLight text-toss-blue' : 'bg-green-100 text-toss-green'
                }`}>
                  {post.type === 'REVIEW' ? '시험 후기' : '문제생성 후기'}
                </span>
                <PostCard post={post as any} href={href} />
              </div>
            )
          })
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <Link
              key={p}
              href={buildUrl({ page: String(p) })}
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold transition-colors ${
                p === page ? 'bg-toss-blue text-white' : 'text-toss-gray600 hover:bg-toss-gray100'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
