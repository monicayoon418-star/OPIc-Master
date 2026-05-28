'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useExamSessionStore } from '@/store/examStore'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import { formatDuration } from '@/lib/utils'
import type { ExamQuestion } from '@/types'

interface ExamData {
  id: string
  questions: ExamQuestion[]
  difficulty1: number
}

export default function ExamTakingPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.examId as string

  const [examData, setExamData] = useState<ExamData | null>(null)
  const [started, setStarted] = useState(false)
  const [showDifficultyModal, setShowDifficultyModal] = useState(false)
  const [selectedDifficulty2, setSelectedDifficulty2] = useState(3)
  const [exitModal, setExitModal] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const {
    currentQuestion, session, recordings, durations, remainingSeconds, isRunning,
    setCurrentQuestion, setSession, addRecording, setIsRunning, setRemainingSeconds, resetSession
  } = useExamSessionStore()

  const { isRecording, startRecording, stopRecording } = useAudioRecorder()
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch(`/api/exam/${examId}`).then(r => r.json()).then(setExamData)
    resetSession()
  }, [examId])

  // Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setRemainingSeconds(remainingSeconds - 1)
        if (remainingSeconds <= 1) handleSubmit()
      }, 1000)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isRunning, remainingSeconds])

  const session1Questions = examData?.questions.filter(q => q.session === 1) ?? []
  const session2Questions = examData?.questions.filter(q => q.session === 2) ?? []
  const currentQuestions = session === 1 ? session1Questions : session2Questions

  const handleStart = () => {
    setStarted(true)
    setIsRunning(true)
  }

  const handleRecord = async () => {
    if (isRecording) {
      const { blob, duration } = await stopRecording()
      addRecording(currentQuestion, blob, duration)
    } else {
      await startRecording(currentQuestion)
    }
  }

  const handleNext = async () => {
    if (isRecording) {
      const { blob, duration } = await stopRecording()
      addRecording(currentQuestion, blob, duration)
    }

    if (session === 1 && currentQuestion === session1Questions.length - 1) {
      setShowDifficultyModal(true)
      return
    }

    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      handleSubmit()
    }
  }

  const handleDifficulty2Submit = () => {
    setShowDifficultyModal(false)
    setSession(2)
    setCurrentQuestion(0)
  }

  const handleSubmit = useCallback(async () => {
    if (submitting) return
    setIsRunning(false)
    setSubmitting(true)

    const answers = Object.entries(recordings).map(([idx, blob]) => ({
      questionIndex: parseInt(idx),
      blob,
      duration: durations[parseInt(idx)] ?? 0,
    }))

    // Upload audio blobs via presigned URLs
    for (const answer of answers) {
      const presignRes = await fetch(`/api/exam/${examId}/presign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIndex: answer.questionIndex }),
      })
      const { uploadUrl, key } = await presignRes.json()
      await fetch(uploadUrl, { method: 'PUT', body: answer.blob, headers: { 'Content-Type': 'audio/webm' } })
      await fetch(`/api/exam/${examId}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionIndex: answer.questionIndex, audioKey: key, duration: answer.duration }),
      })
    }

    await fetch(`/api/exam/${examId}/complete`, { method: 'POST' })
    router.push(`/exam/result/${examId}`)
  }, [examId, recordings, durations, submitting])

  if (!examData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-toss-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-toss-gray600">시험 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-toss-blueLight rounded-full flex items-center justify-center mx-auto mb-6">
            <Icon icon="solar:mic-bold-duotone" className="text-4xl text-toss-blue" />
          </div>
          <h1 className="text-2xl font-bold mb-4">시험을 시작할 준비가 되셨나요?</h1>
          <div className="bg-toss-gray50 rounded-2xl p-5 mb-8 text-left space-y-2">
            {[
              '총 ' + examData.questions.length + '문제, 제한 시간 40분',
              '마이크 사용 권한이 필요합니다',
              '시험 도중 나가면 저장되지 않습니다',
              '조용한 환경에서 응시하세요',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-toss-gray700">
                <Icon icon="solar:check-circle-bold" className="text-toss-green" />
                {item}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => router.push('/exam')}>취소</Button>
            <Button fullWidth size="lg" onClick={handleStart}>시작하기</Button>
          </div>
        </div>
      </div>
    )
  }

  const question = currentQuestions[currentQuestion]
  const isLastQuestion = session === 2 && currentQuestion === currentQuestions.length - 1

  return (
    <div className="min-h-screen flex flex-col" style={{ paddingTop: 0 }}>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-toss-gray100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setExitModal(true)} className="flex items-center gap-1.5 text-sm text-toss-gray500 hover:text-toss-dark">
          <Icon icon="solar:close-bold" />
          나가기
        </button>
        <div className="flex items-center gap-3">
          <span className="text-sm text-toss-gray500">{session === 1 ? '1차' : '2차'} 세션 {currentQuestion + 1}/{currentQuestions.length}</span>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${
            remainingSeconds < 300 ? 'bg-red-100 text-toss-red' : 'bg-toss-blueLight text-toss-blue'
          }`}>
            <Icon icon="solar:clock-circle-bold" />
            {formatDuration(remainingSeconds)}
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-[57px] left-0 right-0 z-40 h-1 bg-toss-gray100">
        <div
          className="h-full bg-toss-blue transition-all"
          style={{ width: `${((currentQuestion + 1) / currentQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-32">
        <div className="w-full max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm font-bold text-toss-gray500">Q{currentQuestion + 1}</span>
            {question?.category && (
              <span className="text-xs px-2.5 py-1 bg-toss-blueLight text-toss-blue rounded-full font-semibold">{question.category}</span>
            )}
          </div>
          <p className="text-xl md:text-2xl font-bold text-toss-dark leading-relaxed keep-all mb-10">
            {question?.content}
          </p>

          {/* Recording */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleRecord}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-toss-red shadow-[0_0_0_8px_rgba(240,68,82,0.2)] animate-pulse'
                  : 'bg-toss-blue shadow-[0_8px_24px_-8px_rgba(49,130,246,0.5)] hover:scale-105'
              }`}
            >
              <Icon icon={isRecording ? 'solar:stop-bold' : 'solar:mic-bold'} className="text-3xl text-white" />
            </button>
          </div>
          <p className="text-center text-sm text-toss-gray500 mb-4">
            {isRecording ? '녹음 중... 답변이 끝나면 다시 탭하세요' : recordings[currentQuestion] ? '녹음 완료 ✓  다시 녹음하려면 탭하세요' : '마이크 버튼을 눌러 녹음을 시작하세요'}
          </p>

          {recordings[currentQuestion] && (
            <div className="flex justify-center mb-4">
              <audio controls src={URL.createObjectURL(recordings[currentQuestion])} className="w-full max-w-xs" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-toss-gray100 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <Button
            fullWidth size="lg"
            onClick={isLastQuestion ? handleSubmit : handleNext}
            loading={submitting}
          >
            {isLastQuestion ? '시험 제출하기' : '다음 문제'}
            {!isLastQuestion && <Icon icon="solar:arrow-right-linear" className="text-xl ml-2" />}
          </Button>
        </div>
      </div>

      {/* Difficulty 2 Modal */}
      <Modal open={showDifficultyModal} onClose={() => {}}>
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">2차 난이도를 선택하세요</h2>
          <p className="text-sm text-toss-gray600 mb-6">1차 세션이 완료되었습니다. 2차 세션 난이도를 선택하세요.</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[1,2,3,4,5,6].map(d => (
              <button key={d} onClick={() => setSelectedDifficulty2(d)}
                className={`py-3 rounded-xl font-bold text-sm transition-all ${selectedDifficulty2 === d ? 'bg-toss-blue text-white' : 'bg-toss-gray50 text-toss-gray700 hover:bg-toss-gray100'}`}>
                {d}단계
              </button>
            ))}
          </div>
          <Button fullWidth onClick={handleDifficulty2Submit}>2차 세션 시작</Button>
        </div>
      </Modal>

      {/* Exit Modal */}
      <Modal open={exitModal} onClose={() => setExitModal(false)} title="시험 나가기">
        <p className="text-sm text-toss-gray600 mb-6">시험에서 나가면 현재 진행 상황이 저장되지 않습니다. 그래도 나가시겠습니까?</p>
        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={() => setExitModal(false)}>아니오</Button>
          <Button variant="danger" fullWidth onClick={() => router.push('/exam')}>예, 나가겠습니다</Button>
        </div>
      </Modal>
    </div>
  )
}
