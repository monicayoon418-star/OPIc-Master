'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function DeletePostButton({ postId, backHref }: { postId: string; backHref: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return
    setLoading(true)
    await fetch(`/api/community/posts/${postId}`, { method: 'DELETE' })
    router.push(backHref)
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-toss-red hover:underline text-sm disabled:opacity-50"
    >
      {loading ? '삭제 중...' : '삭제'}
    </button>
  )
}
