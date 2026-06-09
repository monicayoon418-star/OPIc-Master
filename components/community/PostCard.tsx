import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatTableDate } from '@/lib/utils'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  href: string
  rowNumber?: number
  showType?: boolean
}

const TYPE_LABEL: Record<string, string> = {
  REVIEW: '시험 후기',
  STUDY: '문제생성 후기',
}

export function PostTableHeader({ showType }: { showType?: boolean }) {
  return (
    <div className={`hidden sm:grid text-xs font-medium text-toss-gray500 bg-toss-gray50 border-b border-toss-gray200 px-4 py-2.5 ${showType ? 'grid-cols-[56px_88px_1fr_72px_72px_52px]' : 'grid-cols-[56px_1fr_72px_72px_52px]'}`}>
      <span className="text-center">번호</span>
      {showType && <span className="text-center">게시판</span>}
      <span className="pl-2">제목</span>
      <span className="text-center">글쓴이</span>
      <span className="text-center">등록일</span>
      <span className="text-center">조회</span>
    </div>
  )
}

export default function PostCard({ post, href, rowNumber, showType }: PostCardProps) {
  const isPinned = post.isPinned
  const author = post.isAnonymous ? '익명' : post.user.nickname

  return (
    <Link href={href} className="block group">
      <div className={`grid items-center px-4 py-3 border-b border-toss-gray100 transition-colors group-hover:bg-toss-gray50 text-sm
        ${isPinned ? 'bg-amber-50 group-hover:bg-amber-100/70' : ''}
        ${showType ? 'grid-cols-[56px_88px_1fr_72px_72px_52px]' : 'grid-cols-[56px_1fr_72px_72px_52px]'}
      `}>
        {/* 번호 / 공지 */}
        <span className="text-center text-toss-gray400 text-xs">
          {isPinned
            ? <span className="inline-block px-1.5 py-0.5 bg-toss-blue text-white text-[10px] font-bold rounded">공지</span>
            : rowNumber
          }
        </span>

        {/* 게시판명 */}
        {showType && (
          <span className="text-center">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              post.type === 'REVIEW' ? 'bg-toss-blueLight text-toss-blue' : 'bg-green-100 text-toss-green'
            }`}>
              {TYPE_LABEL[post.type]}
            </span>
          </span>
        )}

        {/* 제목 */}
        <span className="pl-2 min-w-0">
          <span className="font-medium text-toss-dark group-hover:text-toss-blue transition-colors truncate block keep-all">
            {post.title}
            {(post._count?.comments ?? 0) > 0 && (
              <span className="ml-1.5 text-toss-blue text-xs font-semibold">
                [{post._count!.comments}]
              </span>
            )}
          </span>
        </span>

        {/* 글쓴이 */}
        <span className="text-center text-toss-gray600 text-xs truncate">{author}</span>

        {/* 등록일 */}
        <span className="text-center text-toss-gray400 text-xs">{formatTableDate(post.createdAt)}</span>

        {/* 조회수 */}
        <span className="text-center text-toss-gray400 text-xs flex items-center justify-center gap-0.5">
          <Icon icon="solar:eye-bold" className="text-[11px]" />
          {post.viewCount}
        </span>
      </div>
    </Link>
  )
}
