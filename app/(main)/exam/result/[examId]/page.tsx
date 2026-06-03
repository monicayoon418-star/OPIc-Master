import { redirect } from 'next/navigation'

export default async function ResultRedirectPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = await params
  redirect(`/exam/${examId}`)
}
