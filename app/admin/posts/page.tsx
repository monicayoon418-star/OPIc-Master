'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'
import Button from '@/components/ui/Button'

interface AdminPost {
  id: string; title: string; type: string; createdAt: string
  user: { nickname: string }; _count: { comments: number }
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>([])
  const [type, setType] = useState<'ALL' | 'REVIEW' | 'TIP'>('ALL')

  useEffect(() => { fetch('/api/admin/posts').then(r => r.json()).then(d => setPosts(d.data ?? [])) }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return
    await fetch(`/api/community/posts/${id}`, { method: 'DELETE' })
    setPosts(prev => prev.filter(p => p.id !== id))
  }

  const filtered = posts.filter(p => type === 'ALL' || p.type === type)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-toss-dark">게시글 관리</h1>
        <div className="flex gap-2">
          {(['ALL', 'REVIEW', 'TIP'] as const).map(t => (
            <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${type === t ? 'bg-toss-blue text-white' : 'bg-toss-gray100 text-toss-gray600 hover:bg-toss-gray200'}`}>
              {t === 'ALL' ? '전체' : t === 'REVIEW' ? '오픽 후기' : '공부법 후기'}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-toss-gray100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-toss-gray50 text-toss-gray600">
              <th className="text-left px-5 py-3 font-semibold">제목</th>
              <th className="text-left px-4 py-3 font-semibold w-28">작성자</th>
              <th className="text-left px-4 py-3 font-semibold w-24">구분</th>
              <th className="text-center px-4 py-3 font-semibold w-20">댓글</th>
              <th className="text-left px-4 py-3 font-semibold w-32">작성일</th>
              <th className="w-16 px-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-toss-gray100">
            {filtered.map(post => (
              <tr key={post.id} className="hover:bg-toss-gray50/50">
                <td className="px-5 py-3 text-toss-dark truncate max-w-xs">{post.title}</td>
                <td className="px-4 py-3 text-toss-gray600">{post.user.nickname}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${post.type === 'REVIEW' ? 'bg-toss-blueLight text-toss-blue' : 'bg-green-100 text-toss-green'}`}>
                    {post.type === 'REVIEW' ? '후기' : '공부법'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-toss-gray600">{post._count.comments}</td>
                <td className="px-4 py-3 text-toss-gray500">{formatDate(post.createdAt)}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(post.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-toss-gray400 hover:text-toss-red">
                    <Icon icon="solar:trash-bin-2-bold" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
