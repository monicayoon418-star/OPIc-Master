'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function NewReviewPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) { setError('제목과 내용을 입력해주세요.'); return }
    setLoading(true)
    const res = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, type: 'REVIEW' }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.id) router.push(`/community/reviews/${data.id}`)
    else setError(data.error ?? '오류가 발생했습니다.')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-toss-dark mb-8">후기 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="제목" value={title} onChange={e => setTitle(e.target.value)} placeholder="후기 제목을 입력하세요" />
        <Textarea label="내용" value={content} onChange={e => setContent(e.target.value)} rows={12} placeholder="OPIc 시험 경험과 후기를 자유롭게 작성해주세요." />
        {error && <p className="text-sm text-toss-red">{error}</p>}
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>취소</Button>
          <Button type="submit" loading={loading} fullWidth>등록하기</Button>
        </div>
      </form>
    </div>
  )
}
