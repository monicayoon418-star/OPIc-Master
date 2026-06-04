'use client'

import { useState, useRef, useEffect } from 'react'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ReportModal from './ReportModal'

interface PostActionMenuProps {
  postId: string
  postUserId: string
  currentUserId?: string
  isAdmin?: boolean
  editHref: string
  backHref: string
}

export default function PostActionMenu({
  postId,
  postUserId,
  currentUserId,
  isAdmin,
  editHref,
  backHref,
}: PostActionMenuProps) {
  const [open, setOpen] = useState(false)
  const [showReport, setShowReport] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const isOwner = currentUserId === postUserId
  const canDelete = isOwner || isAdmin
  const canReport = !!currentUserId && !isOwner && !isAdmin

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  if (!currentUserId) return null

  const handleDelete = async () => {
    if (!confirm('이 게시글을 삭제하시겠습니까?')) return
    setDeleting(true)
    await fetch(`/api/community/posts/${postId}`, { method: 'DELETE' })
    router.push(backHref)
    router.refresh()
  }

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(v => !v)}
          className="p-1.5 rounded-lg hover:bg-toss-gray100 text-toss-gray500 transition-colors"
        >
          <Icon icon="solar:menu-dots-bold" className="text-lg" />
        </button>
        {open && (
          <div className="absolute right-0 top-8 z-20 bg-white border border-toss-gray200 rounded-2xl shadow-lg py-1.5 w-36 overflow-hidden">
            {isOwner && (
              <Link
                href={editHref}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-toss-gray700 hover:bg-toss-gray50"
                onClick={() => setOpen(false)}
              >
                <Icon icon="solar:pen-bold" className="text-toss-gray500" />
                수정
              </Link>
            )}
            {canDelete && (
              <button
                onClick={() => { setOpen(false); handleDelete() }}
                disabled={deleting}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
              >
                <Icon icon="solar:trash-bin-2-bold" className="text-red-400" />
                {deleting ? '삭제 중...' : '삭제'}
              </button>
            )}
            {canReport && (
              <button
                onClick={() => { setOpen(false); setShowReport(true) }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
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
          type="post"
          postId={postId}
          onClose={() => setShowReport(false)}
        />
      )}
    </>
  )
}
