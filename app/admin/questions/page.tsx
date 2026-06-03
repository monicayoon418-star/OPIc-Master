'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import {
  OCCUPATION_OPTIONS, RESIDENCE_OPTIONS, LEISURE_OPTIONS,
  HOBBY_OPTIONS, SPORT_OPTIONS, VACATION_OPTIONS,
} from '@/types'

interface Question { id: string; content: string; category: string; difficulty: number; keywords: string[]; isActive: boolean }

const KEYWORD_GROUPS = [
  { label: '직업/학업', options: OCCUPATION_OPTIONS.map(o => o.value) },
  { label: '거주지', options: RESIDENCE_OPTIONS.map(o => o.value) },
  { label: '여가 활동', options: LEISURE_OPTIONS },
  { label: '취미/관심사', options: HOBBY_OPTIONS },
  { label: '운동', options: SPORT_OPTIONS },
  { label: '휴가/출장', options: VACATION_OPTIONS },
]

const CATEGORIES = ['자기소개', '거주지', '여가활동', '취미', '운동', '여행', '직업', '롤플레이', '돌발']

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Question | null>(null)
  const [form, setForm] = useState({ content: '', category: '', difficulty: 3, keywords: [] as string[] })
  const [search, setSearch] = useState('')

  useEffect(() => { fetch('/api/admin/questions').then(r => r.json()).then(d => setQuestions(d.data ?? [])) }, [])

  const openNew = () => {
    setEditing(null)
    setForm({ content: '', category: '', difficulty: 3, keywords: [] })
    setModalOpen(true)
  }
  const openEdit = (q: Question) => {
    setEditing(q)
    setForm({ content: q.content, category: q.category, difficulty: q.difficulty, keywords: q.keywords ?? [] })
    setModalOpen(true)
  }

  const toggleKeyword = (kw: string) => {
    setForm(f => ({
      ...f,
      keywords: f.keywords.includes(kw) ? f.keywords.filter(k => k !== kw) : [...f.keywords, kw],
    }))
  }

  const handleSave = async () => {
    const url = editing ? `/api/admin/questions/${editing.id}` : '/api/admin/questions'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const q = await res.json()
    if (editing) setQuestions(prev => prev.map(p => p.id === q.id ? q : p))
    else setQuestions(prev => [q, ...prev])
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const filtered = questions.filter(q => q.content.includes(search) || q.category.includes(search))

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-toss-dark">문제 관리</h1>
        <Button onClick={openNew}><Icon icon="solar:add-circle-bold" className="mr-1.5" />문제 추가</Button>
      </div>

      <div className="flex items-start gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-xs text-yellow-800 mb-6">
        <Icon icon="solar:danger-triangle-bold" className="flex-shrink-0 mt-0.5 text-yellow-600" />
        <p>
          <span className="font-semibold">저작권 주의:</span> 실제 OPIc 기출 문제를 그대로 등록하지 마세요.
          반드시 표현을 변경하거나 유사하게 재작성한 문제만 등록해 주세요.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-toss-gray100 overflow-hidden">
        <div className="p-4 border-b border-toss-gray100">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="문제 검색..." className="w-full px-4 py-2 rounded-xl border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20" />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-toss-gray50 text-toss-gray600">
              <th className="text-left px-5 py-3 font-semibold">문제 내용</th>
              <th className="text-left px-4 py-3 font-semibold w-24">카테고리</th>
              <th className="text-center px-4 py-3 font-semibold w-16">난이도</th>
              <th className="text-left px-4 py-3 font-semibold">키워드</th>
              <th className="w-20 px-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-toss-gray100">
            {filtered.map(q => (
              <tr key={q.id} className="hover:bg-toss-gray50/50">
                <td className="px-5 py-3 text-toss-dark max-w-xs truncate">{q.content}</td>
                <td className="px-4 py-3 text-toss-gray600">{q.category}</td>
                <td className="px-4 py-3 text-center text-toss-gray600">{q.difficulty}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(q.keywords ?? []).slice(0, 3).map(kw => (
                      <span key={kw} className="text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full">{kw}</span>
                    ))}
                    {(q.keywords ?? []).length > 3 && (
                      <span className="text-xs px-2 py-0.5 bg-toss-gray100 text-toss-gray500 rounded-full">+{q.keywords.length - 3}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(q)} className="p-1.5 hover:bg-toss-gray100 rounded-lg text-toss-gray500 hover:text-toss-dark"><Icon icon="solar:pen-bold" /></button>
                    <button onClick={() => handleDelete(q.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-toss-gray500 hover:text-toss-red"><Icon icon="solar:trash-bin-2-bold" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '문제 수정' : '문제 추가'}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Textarea label="문제 내용" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} />

          <div>
            <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">카테고리</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, category: c }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.category === c ? 'bg-toss-blue text-white border-toss-blue' : 'bg-white text-toss-gray700 border-toss-gray200 hover:border-toss-blue/50'}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">난이도</label>
            <div className="flex gap-2">
              {[1,2,3,4,5,6].map(d => (
                <button key={d} onClick={() => setForm(f => ({ ...f, difficulty: d }))}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold ${form.difficulty === d ? 'bg-toss-blue text-white' : 'bg-toss-gray50 text-toss-gray600 hover:bg-toss-gray100'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">
              키워드 태그 <span className="text-toss-gray400 font-normal">({form.keywords.length}개 선택)</span>
            </label>
            <div className="space-y-3">
              {KEYWORD_GROUPS.map(group => (
                <div key={group.label}>
                  <p className="text-xs text-toss-gray500 mb-1.5 font-medium">{group.label}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {group.options.map(kw => (
                      <button key={kw} onClick={() => toggleKeyword(kw)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${form.keywords.includes(kw) ? 'bg-toss-blue text-white border-toss-blue' : 'bg-white text-toss-gray600 border-toss-gray200 hover:border-toss-blue/40'}`}>
                        {kw}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setModalOpen(false)}>취소</Button>
            <Button fullWidth onClick={handleSave} disabled={!form.content || !form.category}>저장</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
