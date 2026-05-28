'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    if (!confirm('해당 사용자를 탈퇴 처리하시겠습니까?')) return
    setLoading(true)
    await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 hover:bg-red-50 rounded-lg text-toss-gray400 hover:text-toss-red disabled:opacity-50"
    >
      <Icon icon="solar:trash-bin-2-bold" />
    </button>
  )
}
