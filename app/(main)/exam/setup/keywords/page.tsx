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
  options, selected, onToggle, label, minSelect = 1
}: {
  options: { value: string; label: string }[] | string[]
  selected: string[]
  onToggle: (v: string) => void
  label: string
  minSelect?: number
}) {
  const items = options.map(o => typeof o === 'string' ? { value: o, label: o } : o)
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="font-bold text-toss-dark text-sm">{label}</h3>
        {minSelect > 1 && <span className="text-xs text-toss-gray500">{minSelect}개 이상 선택</span>}
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
  options, value, onChange, label
}: {
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
  label: string
}) {
  return (
    <div className="mb-8">
      <h3 className="font-bold text-toss-dark text-sm mb-3">{label}</h3>
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

  const totalSelected = [occupation, residence, isStudent].filter(Boolean).length
    + leisure.length + hobbies.length + sports.length + vacation.length

  const canProceed = totalSelected >= 12
    && !!occupation
    && !!isStudent
    && !!residence
    && leisure.length >= 2
    && hobbies.length >= 1
    && sports.length >= 1
    && vacation.length >= 1

  const handleNext = () => {
    setKeywords({
      occupation,
      isStudent: isStudent === '예',
      residence,
      leisure,
      hobbies,
      sports,
      vacation,
    })
    router.push('/exam/setup/preview')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`h-1.5 flex-1 rounded-full ${step <= 2 ? 'bg-toss-blue' : 'bg-toss-gray100'}`} />
        ))}
      </div>
      <p className="text-sm font-semibold text-toss-blue mb-2">2단계 / 3단계</p>
      <h1 className="text-2xl font-bold text-toss-dark mb-2">관심 키워드 선택</h1>

      <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl mb-8 ${totalSelected >= 12 ? 'bg-green-50 text-toss-green' : 'bg-toss-gray50 text-toss-gray600'}`}>
        <Icon icon={totalSelected >= 12 ? 'solar:check-circle-bold' : 'solar:info-circle-bold'} className="text-lg" />
        <span className="text-sm font-semibold">선택된 키워드: {totalSelected}개 {totalSelected < 12 && '(최소 12개 필요)'}</span>
      </div>

      <RadioGroup label="현재 직업/종사 분야 *" options={OCCUPATION_OPTIONS} value={occupation} onChange={setOccupation} />
      <RadioGroup label="현재 학생이신가요? *" options={[{ value: '예', label: '예' }, { value: '아니오', label: '아니오' }]} value={isStudent} onChange={setIsStudent} />
      <RadioGroup label="현재 거주지 *" options={RESIDENCE_OPTIONS} value={residence} onChange={setResidence} />
      <ChipGroup label="여가 활동" options={LEISURE_OPTIONS} selected={leisure} onToggle={v => toggleArr(leisure, setLeisure, v)} minSelect={2} />
      <ChipGroup label="취미 / 관심사" options={HOBBY_OPTIONS} selected={hobbies} onToggle={v => toggleArr(hobbies, setHobbies, v)} minSelect={1} />
      <ChipGroup label="즐기는 운동" options={SPORT_OPTIONS} selected={sports} onToggle={v => toggleArr(sports, setSports, v)} minSelect={1} />
      <ChipGroup label="휴가 / 출장 경험" options={VACATION_OPTIONS} selected={vacation} onToggle={v => toggleArr(vacation, setVacation, v)} minSelect={1} />

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
