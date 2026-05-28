import Link from 'next/link'
import { Icon } from '@iconify/react'
import { formatDate } from '@/lib/utils'
import type { Post } from '@/types'

interface PostCardProps {
  post: Post
  href: string
}

export default function PostCard({ post, href }: PostCardProps) {
  return (
    <Link href={href} className="block group">
      <div className="p-5 border-b border-toss-gray100 hover:bg-toss-gray50/50 transition-colors">
        <p className="font-semibold text-toss-dark mb-1.5 group-hover:text-toss-blue transition-colors line-clamp-2 keep-all">
          {post.title}
        </p>
        <p className="text-sm text-toss-gray600 line-clamp-2 mb-3 keep-all">{post.content}</p>
        <div className="flex items-center gap-3 text-xs text-toss-gray400">
          <span className="font-medium text-toss-gray600">{post.user.nickname}</span>
          <span>{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1 ml-auto">
            <Icon icon="solar:chat-round-bold" className="text-sm" />
            {post._count?.comments ?? 0}
          </span>
          <span className="flex items-center gap-1">
            <Icon icon="solar:eye-bold" className="text-sm" />
            {post.viewCount}
          </span>
        </div>
      </div>
    </Link>
  )
}
