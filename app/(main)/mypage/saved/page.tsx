'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'

interface SavedResource {
  id: string
  resourceId: string
  resource: {
    id: string
    title: string
    thumbnailUrl: string | null
    youtubeUrl: string
    tags: string[]
    createdAt: string
  }
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedResource[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/mypage/saved-resources')
      .then(r => r.json())
      .then(d => setItems(d.data ?? []))
      .finally(() => setLoading(false))
  }, [])

  const handleUnsave = async (resourceId: string) => {
    await fetch(`/api/resources/${resourceId}/save`, { method: 'DELETE' })
    setItems(prev => prev.filter(i => i.resource.id !== resourceId))
  }

  const getThumbnail = (url: string, thumbnailUrl: string | null) => {
    if (thumbnailUrl) return thumbnailUrl
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^#&?]+)/)
    return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : ''
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/mypage" className="text-toss-gray500 hover:text-toss-dark">
          <Icon icon="solar:arrow-left-linear" />
        </Link>
        <h1 className="text-2xl font-bold text-toss-dark">저장한 오픽 자료</h1>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-8 h-8 border-4 border-toss-blue border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center text-toss-gray400">
          <Icon icon="solar:bookmark-bold-duotone" className="text-5xl mx-auto mb-4 block" />
          <p className="font-semibold mb-2">저장한 자료가 없습니다</p>
          <Link href="/resources" className="text-sm text-toss-blue hover:underline">오픽 자료 보러가기</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-4 p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-blue/20 transition-colors">
              <Link href={`/resources/${item.resource.id}`} className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-20 h-14 rounded-xl overflow-hidden bg-toss-gray100 flex-shrink-0">
                  <img
                    src={getThumbnail(item.resource.youtubeUrl, item.resource.thumbnailUrl)}
                    alt={item.resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-toss-dark truncate">{item.resource.title}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.resource.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full">#{t}</span>
                    ))}
                  </div>
                </div>
              </Link>
              <button
                onClick={() => handleUnsave(item.resource.id)}
                className="flex-shrink-0 p-2 rounded-xl hover:bg-red-50 text-toss-blue hover:text-toss-red transition-colors"
                title="저장 해제"
              >
                <Icon icon="solar:bookmark-bold" className="text-xl" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
