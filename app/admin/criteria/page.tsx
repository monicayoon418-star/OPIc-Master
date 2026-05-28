'use client'

import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import { Icon } from '@iconify/react'

export default function CriteriaAdmin() {
  const [content, setContent] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch('/api/admin/criteria').then(r => r.json()).then(d => setContent(d.content ?? ''))
  }, [])

  const handleSave = async () => {
    setLoading(true)
    await fetch('/api/admin/criteria', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    setLoading(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-toss-dark mb-2">문제 생성 기준 관리</h1>
      <p className="text-toss-gray600 mb-6">이 텍스트는 AI 문제 생성 시 시스템 프롬프트로 사용됩니다. 수정 즉시 반영됩니다.</p>

      <div className="bg-white rounded-2xl border border-toss-gray100 p-6">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={20}
          className="w-full text-sm text-toss-dark font-mono border-none outline-none resize-none leading-relaxed"
          placeholder="OPIc 문제 생성 기준을 입력하세요..."
        />
        <div className="flex items-center justify-between pt-4 border-t border-toss-gray100">
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-toss-green font-semibold">
              <Icon icon="solar:check-circle-bold" />저장되었습니다
            </span>
          )}
          <div className="ml-auto">
            <Button loading={loading} onClick={handleSave}>저장하기</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
