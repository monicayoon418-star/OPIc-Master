'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'

const REASONS = ['스팸/도배', '욕설/혐오 발언', '개인정보 노출', '허위 정보', '기타']

interface ReportModalProps {
  type: 'post' | 'comment'
  postId: string
  commentId?: string
  onClose: () => void
}

export default function ReportModal({ type, postId, commentId, onClose }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async () => {
    if (!reason) return
    setLoading(true)
    const url =
      type === 'post'
        ? `/api/community/posts/${postId}/report`
        : `/api/community/posts/${postId}/comments/${commentId}/report`
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    setLoading(false)
    setDone(true)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl" onClick={e => e.stopPropagation()}>
        {done ? (
          <div className="text-center py-4">
            <Icon icon="solar:check-circle-bold-duotone" className="text-4xl text-toss-blue mx-auto mb-3 block" />
            <p className="font-semibold text-toss-dark">신고가 접수되었습니다.</p>
            <p className="text-sm text-toss-gray500 mt-1">검토 후 조치하겠습니다.</p>
            <button
              onClick={onClose}
              className="mt-4 w-full py-2.5 bg-toss-blue text-white rounded-xl text-sm font-semibold"
            >
              확인
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-toss-dark">{type === 'post' ? '게시글' : '댓글'} 신고</h2>
              <button onClick={onClose}>
                <Icon icon="solar:close-bold" className="text-toss-gray500 text-xl" />
              </button>
            </div>
            <p className="text-sm text-toss-gray600 mb-4">신고 사유를 선택해주세요.</p>
            <div className="space-y-2 mb-5">
              {REASONS.map(r => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm text-left font-medium border transition-all ${
                    reason === r
                      ? 'border-toss-blue bg-toss-blueLight text-toss-blue'
                      : 'border-toss-gray200 text-toss-gray700 hover:border-toss-blue/40'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!reason || loading}
              className="w-full py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-red-600 transition-colors"
            >
              {loading ? '처리 중...' : '신고하기'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
