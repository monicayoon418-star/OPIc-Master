'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function BookmarkButton({ resourceId, initialSaved }: { resourceId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      await fetch(`/api/resources/${resourceId}/save`, { method: saved ? 'DELETE' : 'POST' })
      setSaved(!saved)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold border transition-all ${
        saved
          ? 'bg-toss-blueLight text-toss-blue border-toss-blue/30'
          : 'bg-white text-toss-gray600 border-toss-gray200 hover:border-toss-blue/40'
      }`}
    >
      <Icon icon={saved ? 'solar:bookmark-bold' : 'solar:bookmark-linear'} className="text-lg" />
      {saved ? '저장됨' : '저장하기'}
    </button>
  )
}
