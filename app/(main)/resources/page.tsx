import { prisma } from '@/lib/db'
import { getYoutubeThumbnail } from '@/lib/utils'
import { Icon } from '@iconify/react'

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const { tag } = await searchParams

  const resources = await prisma.resource.findMany({
    where: tag ? { tags: { has: tag } } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  const allTags = Array.from(new Set(resources.flatMap(r => r.tags))).sort()

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-toss-dark mb-2">오픽 자료</h1>
        <p className="text-toss-gray600">유익한 유튜브 강의를 모아뒀어요.</p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <a href="/resources" className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${!tag ? 'bg-toss-blue text-white border-toss-blue' : 'bg-white border-toss-gray200 text-toss-gray700 hover:border-toss-blue/50'}`}>
            전체
          </a>
          {allTags.map(t => (
            <a key={t} href={`/resources?tag=${encodeURIComponent(t)}`} className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${tag === t ? 'bg-toss-blue text-white border-toss-blue' : 'bg-white border-toss-gray200 text-toss-gray700 hover:border-toss-blue/50'}`}>
              {t}
            </a>
          ))}
        </div>
      )}

      {resources.length === 0 ? (
        <div className="py-20 text-center text-toss-gray400">
          <Icon icon="solar:video-frame-bold-duotone" className="text-5xl mx-auto mb-4 block" />
          <p className="text-lg font-semibold mb-2">등록된 자료가 없습니다</p>
          <p className="text-sm">관리자가 자료를 추가하면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map(resource => (
            <a
              key={resource.id}
              href={resource.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border border-toss-gray100 rounded-2xl overflow-hidden hover:border-toss-blue/30 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.1)] transition-all"
            >
              <div className="relative aspect-video bg-toss-gray100 overflow-hidden">
                <img
                  src={resource.thumbnailUrl ?? getYoutubeThumbnail(resource.youtubeUrl)}
                  alt={resource.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Icon icon="solar:play-bold" className="text-xl text-white ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-toss-dark text-sm mb-2 line-clamp-2 keep-all">{resource.title}</h3>
                {resource.description && (
                  <p className="text-xs text-toss-gray500 line-clamp-2 mb-3">{resource.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {resource.tags.map(t => (
                    <span key={t} className="text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full font-medium">#{t}</span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
