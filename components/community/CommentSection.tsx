'use client'

import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'
import type { Comment } from '@/types'
import ReportModal from './ReportModal'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  currentUserId?: string
  isAdmin?: boolean
}

function CommentMenu({
  postId,
  comment,
  currentUserId,
  isAdmin,
  onDelete,
}: {
  postId: string
  comment: Comment
  currentUserId?: string
  isAdmin?: boolean
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const isOwner = currentUserId === comment.userId
  const canDelete = isOwner || isAdmin
  const canReport = !!currentUserId && !isOwner && !isAdmin

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!canDelete && !canReport) return null

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(v => !v)}
          className="p-1 rounded-lg hover:bg-toss-gray200 text-toss-gray400 transition-colors"
        >
          <Icon icon="solar:menu-dots-bold" className="text-base" />
        </button>
        {open && (
          <div className="absolute right-0 top-7 z-20 bg-white border border-toss-gray200 rounded-xl shadow-lg py-1 w-28 overflow-hidden">
            {canDelete && (
              <button
                onClick={() => { setOpen(false); onDelete(comment.id) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
              >
                <Icon icon="solar:trash-bin-2-bold" className="text-red-400" />
                삭제
              </button>
            )}
            {canReport && (
              <button
                onClick={() => { setOpen(false); setShowReport(true) }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:bg-red-50"
              >
                <Icon icon="solar:danger-triangle-bold" className="text-red-400" />
                신고하기
              </button>
            )}
          </div>
        )}
      </div>
      {showReport && (
        <ReportModal
          type="comment"
          postId={postId}
          commentId={comment.id}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  )
}

export default function CommentSection({ postId, comments: initial, currentUserId, isAdmin }: CommentSectionProps) {
  const [comments, setComments] = useState(initial)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    const res = await fetch(`/api/community/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })
    const newComment = await res.json()
    setLoading(false)
    if (newComment.id) {
      setComments(prev => [...prev, newComment])
      setContent('')
    }
  }

  const handleDelete = async (commentId: string) => {
    await fetch(`/api/community/posts/${postId}/comments/${commentId}`, { method: 'DELETE' })
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  return (
    <div>
      <h2 className="font-bold text-toss-dark mb-4 flex items-center gap-2">
        <Icon icon="solar:chat-round-bold-duotone" className="text-xl text-toss-blue" />
        댓글 {comments.length}개
      </h2>

      <div className="space-y-3 mb-6">
        {comments.map(comment => (
          <div key={comment.id} className="p-4 bg-toss-gray50 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-toss-dark">{comment.user.nickname}</span>
                <span className="text-xs text-toss-gray400">{formatDate(comment.createdAt)}</span>
              </div>
              <CommentMenu
                postId={postId}
                comment={comment}
                currentUserId={currentUserId}
                isAdmin={isAdmin}
                onDelete={handleDelete}
              />
            </div>
            <p className="text-sm text-toss-gray700 keep-all whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-sm text-toss-gray400 text-center py-6">첫 댓글을 작성해보세요.</p>
        )}
      </div>

      {currentUserId ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows={2}
            className="flex-1 px-4 py-3 rounded-2xl border border-toss-gray200 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-toss-blue/20 focus:border-toss-blue"
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-5 py-2 bg-toss-blue text-white rounded-full text-sm font-semibold hover:bg-toss-blueHover disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          >
            등록
          </button>
        </form>
      ) : (
        <p className="text-sm text-toss-gray500 text-center py-4">댓글을 작성하려면 로그인이 필요합니다.</p>
      )}
    </div>
  )
}
