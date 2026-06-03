import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatDate, getYoutubeThumbnail } from '@/lib/utils'
import UnbookmarkButton from './UnbookmarkButton'

export default async function SavedPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const savedItems = await prisma.savedItem.findMany({
    where: {
      userId: session.user.id,
      OR: [{ postId: { not: null } }, { resourceId: { not: null } }],
    },
    include: {
      post: { select: { id: true, title: true, type: true, createdAt: true, deletedAt: true } },
      resource: { select: { id: true, title: true, thumbnailUrl: true, youtubeUrl: true, tags: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const validItems = savedItems.filter(i => !i.post?.deletedAt)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/mypage" className="text-toss-gray500 hover:text-toss-dark">
          <Icon icon="solar:arrow-left-linear" />
        </Link>
        <h1 className="text-2xl font-bold text-toss-dark">저장한 글/자료</h1>
      </div>

      {validItems.length === 0 ? (
        <div className="py-20 text-center text-toss-gray400">
          <Icon icon="solar:bookmark-bold-duotone" className="text-5xl mx-auto mb-4 block" />
          <p className="font-semibold">저장한 항목이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {validItems.map(item => {
            if (item.post) {
              const href = item.post.type === 'REVIEW'
                ? `/community/reviews/${item.post.id}`
                : `/community/study-tips/${item.post.id}`
              return (
                <div key={item.id} className="flex items-center gap-3 p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 transition-colors">
                  <Link href={href} className="flex items-center gap-3 flex-1 min-w-0">
                    <Icon icon="solar:chat-round-bold-duotone" className="text-xl text-toss-blue flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-toss-dark truncate">{item.post.title}</p>
                      <p className="text-xs text-toss-gray500">
                        {item.post.type === 'REVIEW' ? '시험 후기' : '문제생성 후기'} · {formatDate(item.post.createdAt.toISOString())}
                      </p>
                    </div>
                  </Link>
                  <UnbookmarkButton savedItemId={item.id} />
                </div>
              )
            }
            if (item.resource) {
              const thumb = item.resource.thumbnailUrl ?? getYoutubeThumbnail(item.resource.youtubeUrl)
              return (
                <div key={item.id} className="flex items-center gap-3 p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 transition-colors">
                  <Link href={`/resources/${item.resource.id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-16 h-11 rounded-lg overflow-hidden bg-toss-gray100 flex-shrink-0">
                      <img src={thumb} alt={item.resource.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm text-toss-dark truncate">{item.resource.title}</p>
                      <p className="text-xs text-toss-gray500">오픽 자료</p>
                    </div>
                  </Link>
                  <UnbookmarkButton savedItemId={item.id} />
                </div>
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
