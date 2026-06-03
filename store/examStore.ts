'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ExamKeywords } from '@/types'

interface GenerateSetupState {
  difficulty1: number
  difficulty2: number
  targetLevel: string
  keywords: ExamKeywords
  generatedSetId: string | null

  setDifficulty1: (v: number) => void
  setDifficulty2: (v: number) => void
  setTargetLevel: (v: string) => void
  setKeywords: (k: Partial<ExamKeywords>) => void
  setGeneratedSetId: (id: string) => void
  reset: () => void
}

const initialState = {
  difficulty1: 3,
  difficulty2: 3,
  targetLevel: 'IH',
  keywords: {} as ExamKeywords,
  generatedSetId: null,
}

export const useExamStore = create<GenerateSetupState>()(
  persist(
    (set) => ({
      ...initialState,
      setDifficulty1: (v) => set({ difficulty1: v }),
      setDifficulty2: (v) => set({ difficulty2: v }),
      setTargetLevel: (v) => set({ targetLevel: v }),
      setKeywords: (k) => set((s) => ({ keywords: { ...s.keywords, ...k } })),
      setGeneratedSetId: (id) => set({ generatedSetId: id }),
      reset: () => set(initialState),
    }),
    { name: 'generate-setup' }
  )
)
