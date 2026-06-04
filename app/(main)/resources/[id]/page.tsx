import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getYoutubeThumbnail, formatDate } from '@/lib/utils'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import BookmarkButton from './BookmarkButton'

export default async function ResourceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const resource = await prisma.resource.findUnique({ where: { id } })
  if (!resource) notFound()

  const savedItem = session?.user?.id
    ? await prisma.savedItem.findUnique({
        where: { userId_resourceId: { userId: session.user.id, resourceId: id } },
      })
    : null
  const isSaved = !!savedItem
  const thumbnail = resource.thumbnailUrl ?? getYoutubeThumbnail(resource.youtubeUrl)

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* 뒤로가기 */}
      <Link href="/resources" className="flex items-center gap-1.5 text-sm text-toss-gray500 hover:text-toss-dark mb-6">
        <Icon icon="solar:arrow-left-linear" />
        오픽 자료 목록
      </Link>

      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-toss-dark mb-3 keep-all">{resource.title}</h1>
        <div className="flex items-center gap-3 text-sm text-toss-gray500">
          <span className="flex items-center gap-1">
            <Icon icon="solar:user-bold" className="text-base" />
            운영자
          </span>
          <span>·</span>
          <span>{formatDate(resource.createdAt.toISOString())}</span>
        </div>
      </div>

      {/* 자료 바로보러가기 + 썸네일 */}
      <div className="mb-8">
        <a
          href={resource.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block relative rounded-2xl overflow-hidden border border-toss-gray100 mb-4 aspect-video bg-toss-gray100"
        >
          <img
            src={thumbnail}
            alt={resource.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/25 group-hover:bg-black/35 transition-colors">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Icon icon="solar:play-bold" className="text-3xl text-white ml-1" />
            </div>
          </div>
        </a>
        <a
          href={resource.youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors"
        >
          <Icon icon="solar:play-bold" className="text-lg" />
          자료 바로보러가기
        </a>
      </div>

      {/* 본문 */}
      {resource.description && (
        <div className="p-5 bg-toss-gray50 rounded-2xl mb-6 min-h-[256px]">
          <p className="text-sm text-toss-gray700 leading-relaxed whitespace-pre-wrap">{resource.description}</p>
        </div>
      )}

      {/* 태그 + 북마크 */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex flex-wrap gap-1.5">
          {resource.tags.map(t => (
            <Link
              key={t}
              href={`/resources?tag=${encodeURIComponent(t)}`}
              className="text-sm px-3 py-1 bg-toss-blueLight text-toss-blue rounded-full font-medium hover:bg-toss-blue hover:text-white transition-colors"
            >
              #{t}
            </Link>
          ))}
        </div>
        {session && (
          <BookmarkButton resourceId={resource.id} initialSaved={isSaved} />
        )}
      </div>
    </div>
  )
}
