'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Button from '@/components/ui/Button'

export default function NewStudyTipPage() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await fetch('/api/community/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, type: 'STUDY', isAnonymous }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.id) router.push(`/community/study-tips/${data.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-toss-dark mb-8">문제생성 후기 작성</h1>
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input label="제목" value={title} onChange={e => setTitle(e.target.value)} placeholder="문제생성 후기 제목을 입력하세요" required />
        <Textarea label="내용" value={content} onChange={e => setContent(e.target.value)} rows={12} placeholder="OPIc 문제 생성 후기를 자유롭게 작성해주세요." required />

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
          <Button type="submit" loading={loading} fullWidth>등록하기</Button>
        </div>
      </form>
    </div>
  )
}
