'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function EditReviewPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    fetch(`/api/community/posts/${id}`)
      .then(r => r.json())
      .then(d => { setTitle(d.title ?? ''); setContent(d.content ?? ''); setIsAnonymous(d.isAnonymous ?? false) })
      .finally(() => setFetching(false))
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch(`/api/community/posts/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, isAnonymous }),
    })
    setLoading(false)
    router.push(`/community/reviews/${id}`)
  }

  if (fetching) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-toss-blue border-t-transparent rounded-full animate-spin" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-toss-dark mb-8">시험 후기 수정</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="제목" value={title} onChange={e => setTitle(e.target.value)} required />
        <Textarea label="내용" value={content} onChange={e => setContent(e.target.value)} rows={12} required />

        {/* 익명 토글 */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            onClick={() => setIsAnonymous(v => !v)}
            className={`relative w-10 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-toss-blue' : 'bg-toss-gray200'}`}
          >
            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isAnonymous ? 'translate-x-5' : 'translate-x-1'}`} />
          </div>
          <span className="text-sm text-toss-gray700 font-medium">익명으로 게시</span>
          {isAnonymous && <span className="text-xs text-toss-gray400">글쓴이가 '익명'으로 표시됩니다</span>}
        </label>

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>취소</Button>
          <Button type="submit" loading={loading} fullWidth>수정 완료</Button>
        </div>
      </form>
    </div>
  )
}
