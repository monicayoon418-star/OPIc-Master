'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useExamStore } from '@/store/examStore'
import Button from '@/components/ui/Button'
import {
  OCCUPATION_OPTIONS, RESIDENCE_OPTIONS, LEISURE_OPTIONS,
  HOBBY_OPTIONS, SPORT_OPTIONS, VACATION_OPTIONS
} from '@/types'

function ChipGroup({
  options, selected, onToggle, label, hint,
}: {
  options: { value: string; label: string }[] | string[]
  selected: string[]
  onToggle: (v: string) => void
  label: string
  hint?: string
}) {
  const items = options.map(o => typeof o === 'string' ? { value: o, label: o } : o)
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-toss-dark text-sm">{label}</h3>
        {hint && <span className="text-xs text-toss-gray500">{hint}</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map(item => (
          <button
            key={item.value}
            onClick={() => onToggle(item.value)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all border ${
              selected.includes(item.value)
                ? 'bg-toss-blue text-white border-toss-blue'
                : 'bg-white text-toss-gray700 border-toss-gray200 hover:border-toss-blue/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function RadioGroup({
  options, value, onChange, label, required,
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  label: string
  required?: boolean
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-1.5 mb-3">
        <h3 className="font-bold text-toss-dark text-sm">{label}</h3>
        {required && <span className="text-xs text-toss-red font-semibold">*</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {options.map(item => (
          <button
            key={item.value}
            onClick={() => onChange(item.value)}
            className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all border ${
              value === item.value
                ? 'bg-toss-blue text-white border-toss-blue'
                : 'bg-white text-toss-gray700 border-toss-gray200 hover:border-toss-blue/50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function KeywordsPage() {
  const router = useRouter()
  const { keywords, setKeywords } = useExamStore()

  const [occupation, setOccupation] = useState(keywords.occupation ?? '')
  const [isStudent, setIsStudent] = useState<string>(keywords.isStudent != null ? (keywords.isStudent ? '예' : '아니오') : '')
  const [residence, setResidence] = useState(keywords.residence ?? '')
  const [leisure, setLeisure] = useState<string[]>(keywords.leisure ?? [])
  const [hobbies, setHobbies] = useState<string[]>(keywords.hobbies ?? [])
  const [sports, setSports] = useState<string[]>(keywords.sports ?? [])
  const [vacation, setVacation] = useState<string[]>(keywords.vacation ?? [])

  const toggleArr = (arr: string[], setArr: (v: string[]) => void, val: string) =>
    arr.includes(val) ? setArr(arr.filter(v => v !== val)) : setArr([...arr, val])

  const bgSurveyComplete = !!occupation && !!isStudent && !!residence
  const keywordCount = leisure.length + hobbies.length + sports.length + vacation.length
  const canProceed = bgSurveyComplete && keywordCount >= 12

  const handleNext = () => {
    setKeywords({ occupation, isStudent: isStudent === '예', residence, leisure, hobbies, sports, vacation })
    router.push('/exam/setup/preview')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map(step => (
          <div key={step} className={`h-1.5 flex-1 rounded-full ${step <= 2 ? 'bg-toss-blue' : 'bg-toss-gray100'}`} />
        ))}
      </div>
      <p className="text-sm font-semibold text-toss-blue mb-2">2단계 / 3단계</p>
      <h1 className="text-2xl font-bold text-toss-dark mb-2">관심 키워드 선택</h1>

      {/* Background Survey 섹션 */}
      <div className="p-5 bg-toss-gray50 rounded-2xl border border-toss-gray200 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold text-white bg-toss-gray500 px-2.5 py-1 rounded-full">Background Survey</span>
          <span className="text-xs text-toss-gray500">OPIc 시험 응시 전 필수 설문 항목</span>
        </div>
        <RadioGroup label="현재 직업/종사 분야" options={OCCUPATION_OPTIONS} value={occupation} onChange={setOccupation} required />
        <RadioGroup label="현재 학생이신가요?" options={[{ value: '예', label: '예' }, { value: '아니오', label: '아니오' }]} value={isStudent} onChange={setIsStudent} required />
        <RadioGroup label="현재 거주지" options={RESIDENCE_OPTIONS} value={residence} onChange={setResidence} required />
        <p className={`text-xs mt-2 flex items-center gap-1 ${bgSurveyComplete ? 'text-toss-green' : 'text-toss-gray400'}`}>
          <Icon icon={bgSurveyComplete ? 'solar:check-circle-bold' : 'solar:info-circle-bold'} />
          {bgSurveyComplete ? '완료' : '3가지 항목을 모두 선택해주세요.'}
        </p>
      </div>

      {/* 관심 키워드 섹션 */}
      <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl mb-6 ${keywordCount >= 12 ? 'bg-green-50 text-toss-green' : 'bg-toss-gray50 text-toss-gray600'}`}>
        <Icon icon={keywordCount >= 12 ? 'solar:check-circle-bold' : 'solar:info-circle-bold'} className="text-lg" />
        <span className="text-sm font-semibold">
          선택된 관심 키워드: {keywordCount}개 {keywordCount < 12 && `(최소 12개 필요, ${12 - keywordCount}개 더 선택)`}
        </span>
      </div>

      <ChipGroup label="여가 활동" options={LEISURE_OPTIONS} selected={leisure} onToggle={v => toggleArr(leisure, setLeisure, v)} />
      <ChipGroup label="취미 / 관심사" options={HOBBY_OPTIONS} selected={hobbies} onToggle={v => toggleArr(hobbies, setHobbies, v)} />
      <ChipGroup label="즐기는 운동" options={SPORT_OPTIONS} selected={sports} onToggle={v => toggleArr(sports, setSports, v)} />
      <ChipGroup label="휴가 / 출장 경험" options={VACATION_OPTIONS} selected={vacation} onToggle={v => toggleArr(vacation, setVacation, v)} />

      <div className="flex gap-3">
        <Button variant="secondary" size="lg" onClick={() => router.back()}>이전</Button>
        <Button size="lg" fullWidth disabled={!canProceed} onClick={handleNext}>
          다음 단계
          <Icon icon="solar:arrow-right-linear" className="text-xl ml-2" />
        </Button>
      </div>
    </div>
  )
}
