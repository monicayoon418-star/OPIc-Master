'use client'

import { useState } from 'react'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'
import type { Comment } from '@/types'

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  currentUserId?: string
  isAdmin?: boolean
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
              {(currentUserId === comment.userId || isAdmin) && (
                <button onClick={() => handleDelete(comment.id)} className="text-xs text-toss-gray400 hover:text-toss-red">
                  삭제
                </button>
              )}
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
