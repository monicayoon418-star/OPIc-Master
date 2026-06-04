import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import CommentSection from '@/components/community/CommentSection'
import PostActionMenu from '@/components/community/PostActionMenu'

export default async function StudyTipDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()

  const post = await prisma.post.findUnique({
    where: { id, type: 'STUDY', deletedAt: null },
    include: {
      user: { select: { id: true, nickname: true } },
      comments: {
        where: { deletedAt: null },
        include: { user: { select: { id: true, nickname: true } } },
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!post) notFound()

  await prisma.post.update({ where: { id }, data: { viewCount: { increment: 1 } } })

  const isOwner = session?.user?.id === post.userId
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/community/study-tips" className="flex items-center gap-1 text-sm text-toss-gray500 hover:text-toss-dark mb-4">
          <Icon icon="solar:arrow-left-linear" />
          문제생성 후기 목록
        </Link>
        <h1 className="text-2xl font-bold text-toss-dark mb-3 keep-all">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-toss-gray500">
          <span className="font-medium text-toss-gray700">{post.user.nickname}</span>
          <span>{formatDate(post.createdAt.toISOString())}</span>
          <span className="flex items-center gap-1 ml-auto"><Icon icon="solar:eye-bold" />{post.viewCount}</span>
          <PostActionMenu
            postId={post.id}
            postUserId={post.userId}
            currentUserId={session?.user?.id}
            isAdmin={isAdmin}
            editHref={`/community/study-tips/${post.id}/edit`}
            backHref="/community/study-tips"
          />
        </div>
      </div>

      <div className="whitespace-pre-wrap text-toss-gray800 leading-relaxed mb-10 p-6 bg-white border border-toss-gray100 rounded-2xl text-sm">
        {post.content}
      </div>

      <CommentSection
        postId={post.id}
        comments={post.comments as any}
        currentUserId={session?.user?.id}
        isAdmin={isAdmin}
      />
    </div>
  )
}
