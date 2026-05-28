'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useExamStore } from '@/store/examStore'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function PreviewPage() {
  const router = useRouter()
  const { difficulty1, difficulty2, targetLevel, keywords, setExamId } = useExamStore()
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [examReady, setExamReady] = useState<{ id: string; questions: { content: string; category: string; session: number }[] } | null>(null)

  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty1, difficulty2, targetLevel, keywords }),
      })
      const data = await res.json()
      if (data.examId) {
        setExamId(data.examId)
        setExamReady(data)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (!examReady) return
    const text = examReady.questions.map((q, i) => `${i + 1}. [${q.category}] ${q.content}`).join('\n')
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'opic_questions.txt'
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
      <p className="text-toss-gray600 mb-8">선택한 설정을 확인하고 문제를 생성하세요.</p>

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
      {examReady && (
        <div className="border border-toss-gray100 rounded-3xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-toss-dark">생성된 문제 ({examReady.questions.length}개)</h2>
            <button onClick={handleDownload} className="flex items-center gap-1 text-sm text-toss-blue font-semibold hover:underline">
              <Icon icon="solar:download-bold" />
              다운로드
            </button>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {examReady.questions.map((q, i) => (
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

      <div className="flex flex-col gap-3">
        {!examReady ? (
          <Button size="lg" fullWidth loading={loading} onClick={handleGenerate}>
            <Icon icon="solar:magic-stick-bold" className="text-xl mr-2" />
            AI 문제 생성하기
          </Button>
        ) : (
          <>
            <Button size="lg" fullWidth onClick={() => setConfirmOpen(true)}>
              <Icon icon="solar:play-bold" className="text-xl mr-2" />
              시험 시작하기
            </Button>
            <Button variant="secondary" size="lg" fullWidth onClick={handleDownload}>
              <Icon icon="solar:download-bold" className="text-xl mr-2" />
              시험 문제만 다운받기
            </Button>
          </>
        )}
        <Button variant="ghost" onClick={() => router.back()}>이전으로</Button>
      </div>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div className="text-center">
          <div className="w-14 h-14 bg-toss-blueLight rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon icon="solar:alarm-bold-duotone" className="text-2xl text-toss-blue" />
          </div>
          <h2 className="text-lg font-bold mb-2">시험을 시작할까요?</h2>
          <p className="text-sm text-toss-gray600 mb-6 keep-all">
            시험의 제한시간은 40분이며, 도중에 멈출 수 없으니 주변 환경을 체크해주세요.
          </p>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setConfirmOpen(false)}>아니오</Button>
            <Button fullWidth onClick={() => router.push(`/exam/${examReady?.id}`)}>예, 시작합니다</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
