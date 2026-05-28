'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExamKeywords } from '@/types'

interface ExamSetupState {
  difficulty1: number
  difficulty2: number
  targetLevel: string
  keywords: ExamKeywords
  examId: string | null

  setDifficulty1: (v: number) => void
  setDifficulty2: (v: number) => void
  setTargetLevel: (v: string) => void
  setKeywords: (k: Partial<ExamKeywords>) => void
  setExamId: (id: string) => void
  reset: () => void
}

const initialState = {
  difficulty1: 3,
  difficulty2: 3,
  targetLevel: 'IH',
  keywords: {} as ExamKeywords,
  examId: null,
}

export const useExamStore = create<ExamSetupState>()(
  persist(
    (set) => ({
      ...initialState,
      setDifficulty1: (v) => set({ difficulty1: v }),
      setDifficulty2: (v) => set({ difficulty2: v }),
      setTargetLevel: (v) => set({ targetLevel: v }),
      setKeywords: (k) => set((s) => ({ keywords: { ...s.keywords, ...k } })),
      setExamId: (id) => set({ examId: id }),
      reset: () => set(initialState),
    }),
    { name: 'exam-setup' }
  )
)

interface ExamSessionState {
  currentQuestion: number
  session: 1 | 2
  recordings: Record<number, Blob>
  durations: Record<number, number>
  isRunning: boolean
  remainingSeconds: number

  setCurrentQuestion: (i: number) => void
  setSession: (s: 1 | 2) => void
  addRecording: (index: number, blob: Blob, duration: number) => void
  setIsRunning: (v: boolean) => void
  setRemainingSeconds: (v: number) => void
  resetSession: () => void
}

export const useExamSessionStore = create<ExamSessionState>((set) => ({
  currentQuestion: 0,
  session: 1,
  recordings: {},
  durations: {},
  isRunning: false,
  remainingSeconds: 40 * 60,

  setCurrentQuestion: (i) => set({ currentQuestion: i }),
  setSession: (s) => set({ session: s }),
  addRecording: (index, blob, duration) =>
    set((state) => ({
      recordings: { ...state.recordings, [index]: blob },
      durations: { ...state.durations, [index]: duration },
    })),
  setIsRunning: (v) => set({ isRunning: v }),
  setRemainingSeconds: (v) => set({ remainingSeconds: v }),
  resetSession: () =>
    set({
      currentQuestion: 0,
      session: 1,
      recordings: {},
      durations: {},
      isRunning: false,
      remainingSeconds: 40 * 60,
    }),
}))
