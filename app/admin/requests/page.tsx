'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import type { Request } from '@/types'

interface AdminRequest extends Request {
  user: { nickname: string; email?: string | null }
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminRequest[]>([])
  const [selected, setSelected] = useState<AdminRequest | null>(null)
  const [response, setResponse] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'ANSWERED'>('ALL')

  useEffect(() => { fetch('/api/admin/requests').then(r => r.json()).then(d => setRequests(d.data ?? [])) }, [])

  const handleRespond = async () => {
    if (!selected || !response.trim()) return
    setLoading(true)
    await fetch(`/api/admin/requests/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response }),
    })
    setRequests(prev => prev.map(r => r.id === selected.id ? { ...r, status: 'ANSWERED', response, respondedAt: new Date().toISOString() } : r))
    setLoading(false)
    setSelected(null)
    setResponse('')
  }

  const filtered = requests.filter(r => filter === 'ALL' || r.status === filter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-toss-dark">요청사항 관리</h1>
        <div className="flex gap-2">
          {(['ALL', 'PENDING', 'ANSWERED'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${filter === f ? 'bg-toss-blue text-white' : 'bg-toss-gray100 text-toss-gray600 hover:bg-toss-gray200'}`}>
              {f === 'ALL' ? '전체' : f === 'PENDING' ? '미처리' : '처리완료'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-toss-gray100 divide-y divide-toss-gray100">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-toss-gray400">요청이 없습니다.</div>
        )}
        {filtered.map(req => (
          <div key={req.id} className="p-5 hover:bg-toss-gray50/50 cursor-pointer" onClick={() => { setSelected(req); setResponse(req.response ?? '') }}>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-sm text-toss-dark">{req.user.nickname}</span>
              <span className="text-xs text-toss-gray400">{req.user.email}</span>
              <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${req.status === 'ANSWERED' ? 'bg-green-100 text-toss-green' : 'bg-yellow-100 text-yellow-700'}`}>
                {req.status === 'ANSWERED' ? '처리완료' : '미처리'}
              </span>
              <span className="text-xs text-toss-gray400">{formatDate(req.createdAt)}</span>
            </div>
            <p className="text-sm text-toss-gray700 line-clamp-2">{req.content}</p>
          </div>
        ))}
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="요청사항 답변">
        {selected && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-toss-gray500 font-semibold mb-1">{selected.user.nickname}의 요청</p>
              <p className="text-sm text-toss-gray700 bg-toss-gray50 rounded-xl p-3">{selected.content}</p>
            </div>
            <Textarea label="답변 작성" value={response} onChange={e => setResponse(e.target.value)} rows={4} placeholder="답변 내용을 작성하세요." />
            <div className="flex gap-3">
              <Button variant="secondary" fullWidth onClick={() => setSelected(null)}>취소</Button>
              <Button fullWidth loading={loading} disabled={!response.trim()} onClick={handleRespond}>답변 등록</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
