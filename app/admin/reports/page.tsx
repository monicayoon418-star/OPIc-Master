'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'

interface ReportItem {
  id: string
  reason: string
  handled: boolean
  createdAt: string
  reporter: { id: string; nickname: string }
  reported: { id: string; nickname: string; deletedAt: string | null }
  post: { id: string; title: string; type: string; deletedAt: string | null } | null
  comment: { id: string; content: string; deletedAt: string | null } | null
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'HANDLED'>('PENDING')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/reports')
      .then(r => r.json())
      .then(d => { setReports(d.data ?? []); setLoading(false) })
  }, [])

  const handleAction = async (id: string, action: 'dismiss' | 'delete_content' | 'delete_and_ban') => {
    const messages: Record<string, string> = {
      dismiss: '이 신고를 무시하시겠습니까?',
      delete_content: '해당 콘텐츠를 삭제하시겠습니까?',
      delete_and_ban: '콘텐츠를 삭제하고 사용자를 강퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.',
    }
    if (!confirm(messages[action])) return

    await fetch(`/api/admin/reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })

    setReports(prev => prev.map(r => r.id === id ? { ...r, handled: true } : r))
  }

  const filtered = reports.filter(r =>
    filter === 'ALL' ? true : filter === 'PENDING' ? !r.handled : r.handled
  )

  const pendingCount = reports.filter(r => !r.handled).length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-toss-dark">신고 관리</h1>
          {pendingCount > 0 && (
            <p className="text-sm text-red-500 mt-1">미처리 신고 {pendingCount}건</p>
          )}
        </div>
        <div className="flex gap-2">
          {(['PENDING', 'ALL', 'HANDLED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                filter === f ? 'bg-toss-blue text-white' : 'bg-toss-gray100 text-toss-gray600 hover:bg-toss-gray200'
              }`}
            >
              {f === 'PENDING' ? '미처리' : f === 'ALL' ? '전체' : '처리완료'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-toss-gray400">불러오는 중...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-toss-gray400">
          <Icon icon="solar:shield-check-bold-duotone" className="text-4xl mx-auto mb-3 block text-toss-gray300" />
          <p>신고 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(report => {
            const isContentDeleted = report.comment
              ? !!report.comment.deletedAt
              : !!report.post?.deletedAt
            const isUserBanned = !!report.reported.deletedAt

            return (
              <div
                key={report.id}
                className={`bg-white border rounded-2xl p-5 ${report.handled ? 'border-toss-gray100 opacity-60' : 'border-toss-gray200'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* 신고 대상 */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        report.comment
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-toss-blueLight text-toss-blue'
                      }`}>
                        {report.comment ? '댓글' : '게시글'}
                      </span>
                      {report.handled && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-toss-gray100 text-toss-gray500">
                          처리완료
                        </span>
                      )}
                      {isContentDeleted && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-500">
                          콘텐츠삭제됨
                        </span>
                      )}
                      {isUserBanned && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-red-100 text-red-500">
                          강퇴됨
                        </span>
                      )}
                    </div>

                    {/* 신고 내용 */}
                    <div className="space-y-1 mb-3">
                      {report.post && (
                        <p className="text-sm text-toss-dark font-medium truncate">
                          게시글: {report.post.title}
                        </p>
                      )}
                      {report.comment && (
                        <p className="text-sm text-toss-gray700 line-clamp-2">
                          댓글: "{report.comment.content}"
                        </p>
                      )}
                    </div>

                    {/* 메타 정보 */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-toss-gray500">
                      <span>신고자: <span className="font-medium text-toss-gray700">{report.reporter.nickname}</span></span>
                      <span>피신고자: <span className="font-medium text-toss-gray700">{report.reported.nickname}</span></span>
                      <span className="flex items-center gap-1">
                        <Icon icon="solar:danger-triangle-bold" className="text-red-400" />
                        사유: <span className="font-medium text-toss-gray700">{report.reason}</span>
                      </span>
                      <span>{formatDate(report.createdAt)}</span>
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  {!report.handled && (
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAction(report.id, 'dismiss')}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-toss-gray100 text-toss-gray600 hover:bg-toss-gray200 transition-colors whitespace-nowrap"
                      >
                        무시
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'delete_content')}
                        disabled={isContentDeleted}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        콘텐츠 삭제
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'delete_and_ban')}
                        disabled={isUserBanned}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-colors whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        삭제 + 강퇴
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
