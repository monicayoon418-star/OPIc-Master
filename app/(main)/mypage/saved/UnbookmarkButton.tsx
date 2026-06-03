'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

export default function UnbookmarkButton({ savedItemId }: { savedItemId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRemove = async () => {
    setLoading(true)
    await fetch(`/api/mypage/saved/${savedItemId}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleRemove}
      disabled={loading}
      className="flex-shrink-0 p-2 rounded-xl hover:bg-red-50 text-toss-gray400 hover:text-toss-red transition-colors"
      title="저장 해제"
    >
      <Icon icon="solar:bookmark-bold" className="text-xl text-toss-blue" />
    </button>
  )
}
