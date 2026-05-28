import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { getPresignedUploadUrl, buildAudioKey } from '@/lib/s3'

export async function POST(req: NextRequest, { params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { questionIndex } = await req.json()
  const key = buildAudioKey(examId, questionIndex)
  const uploadUrl = await getPresignedUploadUrl(key, 'audio/webm')

  return NextResponse.json({ uploadUrl, key })
}
