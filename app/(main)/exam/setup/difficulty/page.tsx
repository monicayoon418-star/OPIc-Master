'use client'

import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useExamStore } from '@/store/examStore'
import Button from '@/components/ui/Button'
import { OPIC_LEVELS } from '@/types'

const DIFFICULTY_INFO = [
  { level: 1, label: '매우 쉬움', desc: 'NH~IL 수준, 기초 단어와 간단한 문장' },
  { level: 2, label: '쉬움', desc: 'IL~IM1 수준, 단순한 일상 표현' },
  { level: 3, label: '보통', desc: 'IM1~IM2 수준, 일상적인 주제 대화 가능' },
  { level: 4, label: '중상', desc: 'IM2~IM3 수준, 다양한 주제 설명 가능' },
  { level: 5, label: '어려움', desc: 'IM3~IH 수준, 복잡한 주제 유창하게 설명' },
  { level: 6, label: '매우 어려움', desc: 'IH~AL 수준, 원어민 수준의 표현' },
]

export default function DifficultyPage() {
  const router = useRouter()
  const { difficulty1, targetLevel, setDifficulty1, setTargetLevel } = useExamStore()

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`h-1.5 flex-1 rounded-full ${step === 1 ? 'bg-toss-blue' : 'bg-toss-gray100'}`} />
        ))}
      </div>
      <p className="text-sm font-semibold text-toss-blue mb-2">1단계 / 3단계</p>
      <h1 className="text-2xl font-bold text-toss-dark mb-2">난이도를 선택하세요</h1>
      <p className="text-toss-gray600 mb-8">현재 본인의 영어 말하기 수준에 맞는 난이도를 선택하세요.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {DIFFICULTY_INFO.map((item) => (
          <button
            key={item.level}
            onClick={() => setDifficulty1(item.level)}
            className={`p-4 rounded-2xl border-2 text-left transition-all hover:border-toss-blue/50 ${
              difficulty1 === item.level
                ? 'border-toss-blue bg-toss-blueLight'
                : 'border-toss-gray100 bg-white hover:bg-toss-gray50'
            }`}
          >
            <div className={`text-2xl font-bold mb-1 ${difficulty1 === item.level ? 'text-toss-blue' : 'text-toss-dark'}`}>
              {item.level}단계
            </div>
            <div className="text-sm font-semibold text-toss-dark mb-1">{item.label}</div>
            <div className="text-xs text-toss-gray500 keep-all">{item.desc}</div>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-toss-dark mb-3">목표 등급</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          {OPIC_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setTargetLevel(level)}
              className={`py-2.5 px-2 rounded-xl text-sm font-bold transition-all ${
                targetLevel === level
                  ? 'bg-toss-blue text-white shadow-[0_4px_12px_-4px_rgba(49,130,246,0.5)]'
                  : 'bg-toss-gray50 text-toss-gray600 hover:bg-toss-gray100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <Button size="lg" fullWidth onClick={() => router.push('/exam/setup/keywords')}>
        다음 단계
        <Icon icon="solar:arrow-right-linear" className="text-xl ml-2" />
      </Button>
    </div>
  )
}
