import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'

export default async function SavedPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const savedItems = await prisma.savedItem.findMany({
    where: { userId: session.user.id },
    include: {
      post: { select: { id: true, title: true, type: true, createdAt: true } },
      resource: { select: { id: true, title: true, tags: true, createdAt: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/mypage" className="text-toss-gray500 hover:text-toss-dark"><Icon icon="solar:arrow-left-linear" /></Link>
        <h1 className="text-2xl font-bold text-toss-dark">저장한 글</h1>
      </div>

      {savedItems.length === 0 ? (
        <div className="py-20 text-center text-toss-gray400">
          <Icon icon="solar:bookmark-bold-duotone" className="text-5xl mx-auto mb-4 block" />
          <p className="font-semibold">저장한 글이 없습니다</p>
        </div>
      ) : (
        <div className="space-y-2">
          {savedItems.map(item => {
            if (item.post) {
              const href = item.post.type === 'REVIEW' ? `/community/reviews/${item.post.id}` : `/community/study-tips/${item.post.id}`
              return (
                <Link key={item.id} href={href} className="flex items-center gap-4 p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 transition-colors">
                  <Icon icon="solar:chat-round-bold-duotone" className="text-xl text-toss-blue flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-toss-dark truncate">{item.post.title}</p>
                    <p className="text-xs text-toss-gray500">{item.post.type === 'REVIEW' ? '후기' : '공부법'} · {formatDate(item.post.createdAt.toISOString())}</p>
                  </div>
                  <Icon icon="solar:arrow-right-linear" className="text-toss-gray400 flex-shrink-0" />
                </Link>
              )
            }
            if (item.resource) {
              return (
                <Link key={item.id} href="/resources" className="flex items-center gap-4 p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 transition-colors">
                  <Icon icon="solar:video-frame-bold-duotone" className="text-xl text-toss-green flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-toss-dark truncate">{item.resource.title}</p>
                    <p className="text-xs text-toss-gray500">유튜브 자료 · {formatDate(item.resource.createdAt.toISOString())}</p>
                  </div>
                  <Icon icon="solar:arrow-right-linear" className="text-toss-gray400 flex-shrink-0" />
                </Link>
              )
            }
            return null
          })}
        </div>
      )}
    </div>
  )
}
