'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import type { Request } from '@/types'

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  useEffect(() => {
    fetch('/api/requests').then(r => r.json()).then(data => setRequests(data.data ?? []))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    const res = await fetch('/api/requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    const newReq = await res.json()
    setLoading(false)
    if (newReq.id) {
      setRequests(prev => [newReq, ...prev])
      setContent('')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/mypage" className="text-toss-gray500 hover:text-toss-dark"><Icon icon="solar:arrow-left-linear" /></Link>
        <h1 className="text-2xl font-bold text-toss-dark">요청사항</h1>
      </div>

      {/* New Request Form */}
      <div className="bg-toss-gray50 rounded-3xl p-6 mb-8">
        <h2 className="font-bold text-toss-dark mb-4">새 요청 작성</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <Textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={4}
            placeholder="관리자에게 문의하고 싶은 내용을 작성해주세요."
          />
          <Button type="submit" loading={loading} disabled={!content.trim()}>
            요청하기
          </Button>
        </form>
      </div>

      {/* Request List */}
      <h2 className="font-bold text-toss-dark mb-4">요청 내역</h2>
      {requests.length === 0 ? (
        <p className="text-sm text-toss-gray400 text-center py-10">요청 내역이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {requests.map(req => (
            <button
              key={req.id}
              onClick={() => req.status === 'ANSWERED' ? setSelectedRequest(req) : null}
              className={`w-full text-left p-4 border rounded-2xl transition-colors ${
                req.status === 'ANSWERED'
                  ? 'border-toss-green/30 bg-green-50 hover:border-toss-green/50 cursor-pointer'
                  : 'border-toss-gray100 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${req.status === 'ANSWERED' ? 'bg-toss-green text-white' : 'bg-toss-gray100 text-toss-gray600'}`}>
                  {req.status === 'ANSWERED' ? '답변 완료' : '처리 중'}
                </span>
                <span className="text-xs text-toss-gray400">{formatDate(req.createdAt)}</span>
              </div>
              <p className="text-sm text-toss-gray700 line-clamp-2">{req.content}</p>
              {req.status === 'ANSWERED' && (
                <p className="text-xs text-toss-green mt-2 flex items-center gap-1">
                  <Icon icon="solar:chat-round-bold" />
                  답변 확인하기
                </p>
              )}
            </button>
          ))}
        </div>
      )}

      <Modal open={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="요청 답변">
        {selectedRequest && (
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-toss-gray500 mb-1">내 요청</p>
              <p className="text-sm text-toss-gray700 bg-toss-gray50 rounded-xl p-3">{selectedRequest.content}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-toss-green mb-1">관리자 답변</p>
              <p className="text-sm text-toss-dark bg-green-50 rounded-xl p-3">{selectedRequest.response}</p>
            </div>
            {selectedRequest.respondedAt && (
              <p className="text-xs text-toss-gray400 text-right">{formatDate(selectedRequest.respondedAt)}</p>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
