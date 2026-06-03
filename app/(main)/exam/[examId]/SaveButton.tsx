'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'

export default function SaveButton({ setId, initialSaved }: { setId: string; initialSaved: boolean }) {
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  const toggle = async () => {
    setLoading(true)
    try {
      const method = saved ? 'DELETE' : 'POST'
      await fetch(`/api/exam/${setId}/save`, { method })
      setSaved(!saved)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button variant="secondary" className="flex-1" onClick={toggle} loading={loading}>
      <Icon icon={saved ? 'solar:bookmark-bold' : 'solar:bookmark-linear'} className="mr-2 text-toss-blue" />
      {saved ? '저장됨' : '저장하기'}
    </Button>
  )
}
