import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { formatDate } from '@/lib/utils'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import CommentSection from '@/components/community/CommentSection'

export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  const session = await auth()

  const post = await prisma.post.findUnique({
    where: { id: params.id, deletedAt: null },
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

  await prisma.post.update({ where: { id: params.id }, data: { viewCount: { increment: 1 } } })

  const isOwner = session?.user?.id === post.userId
  const isAdmin = session?.user?.role === 'ADMIN'

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link href="/community/reviews" className="flex items-center gap-1 text-sm text-toss-gray500 hover:text-toss-dark mb-4">
          <Icon icon="solar:arrow-left-linear" />
          오픽 후기 목록
        </Link>
        <h1 className="text-2xl font-bold text-toss-dark mb-3 keep-all">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-toss-gray500">
          <span className="font-medium text-toss-gray700">{post.user.nickname}</span>
          <span>{formatDate(post.createdAt.toISOString())}</span>
          <span className="flex items-center gap-1 ml-auto"><Icon icon="solar:eye-bold" />{post.viewCount}</span>
          {(isOwner || isAdmin) && (
            <div className="flex gap-2">
              {isOwner && <Link href={`/community/reviews/${post.id}/edit`} className="text-toss-blue hover:underline">수정</Link>}
              <DeletePostButton postId={post.id} isAdmin={isAdmin} />
            </div>
          )}
        </div>
      </div>

      <div className="prose prose-sm max-w-none text-toss-gray800 leading-relaxed whitespace-pre-wrap mb-10 p-6 bg-white border border-toss-gray100 rounded-2xl">
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

function DeletePostButton({ postId, isAdmin }: { postId: string; isAdmin: boolean }) {
  return (
    <form action={`/api/community/posts/${postId}`} method="DELETE">
      <button type="submit" className="text-toss-red hover:underline text-sm">삭제</button>
    </form>
  )
}
