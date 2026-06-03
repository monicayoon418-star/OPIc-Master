'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useExamStore } from '@/store/examStore'
import Button from '@/components/ui/Button'

export default function PreviewPage() {
  const router = useRouter()
  const { difficulty1, difficulty2, targetLevel, keywords, setGeneratedSetId } = useExamStore()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ id: string; questions: { content: string; category: string; session: number }[] } | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty1, difficulty2, targetLevel, keywords }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? '문제 생성에 실패했습니다. 잠시 후 다시 시도해주세요.')
        return
      }
      if (data.setId) {
        setGeneratedSetId(data.setId)
        setResult(data)
      }
    } catch (e) {
      setError(`오류: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!result) return
    setSaving(true)
    try {
      await fetch(`/api/exam/${result.id}/save`, { method: 'POST' })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  const handleDownload = () => {
    if (!result) return
    const lines = result.questions.map((q, i) =>
      `Q${i + 1}. [${q.session === 1 ? '1차' : '2차'} / ${q.category}]\n${q.content}`
    )
    const text = `OPIc 예상 문제\n난이도 ${difficulty1}단계 | 목표 등급 ${targetLevel}\n\n` + lines.join('\n\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `opic_questions_${targetLevel}.txt`
    a.click()
  }

  const allKeywords = [
    keywords.occupation,
    keywords.isStudent != null ? (keywords.isStudent ? '학생 (예)' : '학생 (아니오)') : null,
    keywords.residence,
    ...(keywords.leisure ?? []),
    ...(keywords.hobbies ?? []),
    ...(keywords.sports ?? []),
    ...(keywords.vacation ?? []),
  ].filter(Boolean) as string[]

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="h-1.5 flex-1 rounded-full bg-toss-blue" />
        ))}
      </div>
      <p className="text-sm font-semibold text-toss-blue mb-2">3단계 / 3단계</p>
      <h1 className="text-2xl font-bold text-toss-dark mb-2">설정 확인 및 문제 생성</h1>
      <p className="text-toss-gray600 mb-8">선택한 설정을 확인하고 AI 문제를 생성하세요.</p>

      {/* Settings Summary */}
      <div className="bg-toss-gray50 rounded-3xl p-6 mb-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-toss-gray600">난이도</span>
          <span className="font-bold text-toss-dark">{difficulty1}단계</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-toss-gray600">목표 등급</span>
          <span className="font-bold text-toss-blue">{targetLevel}</span>
        </div>
        <div>
          <span className="text-sm text-toss-gray600 block mb-2">선택된 키워드 ({allKeywords.length}개)</span>
          <div className="flex flex-wrap gap-1.5">
            {allKeywords.slice(0, 12).map(k => (
              <span key={k} className="px-2.5 py-1 bg-white border border-toss-gray200 rounded-full text-xs text-toss-gray700">{k}</span>
            ))}
            {allKeywords.length > 12 && (
              <span className="px-2.5 py-1 bg-toss-blueLight text-toss-blue rounded-full text-xs font-semibold">+{allKeywords.length - 12}개</span>
            )}
          </div>
        </div>
      </div>

      {/* Generated Questions */}
      {result && (
        <div className="border border-toss-gray100 rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-toss-dark">생성된 문제 ({result.questions.length}개)</h2>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {result.questions.map((q, i) => (
              <div key={i} className="p-3 bg-toss-gray50 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-toss-gray500">Q{i + 1}</span>
                  <span className="text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full font-semibold">{q.category}</span>
                  <span className="text-xs px-2 py-0.5 bg-toss-gray100 text-toss-gray600 rounded-full">{q.session === 1 ? '1차' : '2차'} 세션</span>
                </div>
                <p className="text-sm text-toss-dark">{q.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-100 rounded-2xl mb-4">
          <Icon icon="solar:danger-bold" className="text-toss-red flex-shrink-0" />
          <p className="text-sm text-toss-red">{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {!result ? (
          <Button size="lg" fullWidth loading={loading} onClick={handleGenerate}>
            <Icon icon="solar:magic-stick-bold" className="text-xl mr-2" />
            AI 문제 생성하기
          </Button>
        ) : (
          <>
            <Button size="lg" fullWidth onClick={handleSave} loading={saving} disabled={saved}>
              {saved ? (
                <>
                  <Icon icon="solar:check-circle-bold" className="text-xl mr-2" />
                  저장 완료
                </>
              ) : (
                <>
                  <Icon icon="solar:bookmark-bold" className="text-xl mr-2" />
                  마이페이지에 저장하기
                </>
              )}
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={handleDownload}>
              <Icon icon="solar:download-bold" className="text-xl mr-2" />
              문제 다운로드 (.txt)
            </Button>
            <Button variant="ghost" size="lg" fullWidth onClick={handleGenerate} loading={loading}>
              <Icon icon="solar:restart-bold" className="text-xl mr-2" />
              다시 생성하기
            </Button>
          </>
        )}
        <Button variant="ghost" onClick={() => router.back()}>이전으로</Button>
      </div>
    </div>
  )
}
