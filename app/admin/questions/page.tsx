'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Question { id: string; content: string; category: string; difficulty: number; isActive: boolean }

export default function QuestionsAdmin() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Question | null>(null)
  const [form, setForm] = useState({ content: '', category: '', difficulty: 3 })
  const [search, setSearch] = useState('')

  useEffect(() => { fetch('/api/admin/questions').then(r => r.json()).then(d => setQuestions(d.data ?? [])) }, [])

  const openNew = () => { setEditing(null); setForm({ content: '', category: '', difficulty: 3 }); setModalOpen(true) }
  const openEdit = (q: Question) => { setEditing(q); setForm({ content: q.content, category: q.category, difficulty: q.difficulty }); setModalOpen(true) }

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-toss-dark">기출 문제 관리</h1>
        <Button onClick={openNew}><Icon icon="solar:add-circle-bold" className="mr-1.5" />문제 추가</Button>
      </div>

      <div className="bg-white rounded-2xl border border-toss-gray100 overflow-hidden">
        <div className="p-4 border-b border-toss-gray100">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="문제 검색..." className="w-full px-4 py-2 rounded-xl border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20" />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-toss-gray50 text-toss-gray600">
              <th className="text-left px-5 py-3 font-semibold">문제 내용</th>
              <th className="text-left px-4 py-3 font-semibold w-28">카테고리</th>
              <th className="text-center px-4 py-3 font-semibold w-20">난이도</th>
              <th className="text-center px-4 py-3 font-semibold w-20">상태</th>
              <th className="w-20 px-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-toss-gray100">
            {filtered.map(q => (
              <tr key={q.id} className="hover:bg-toss-gray50/50">
                <td className="px-5 py-3 text-toss-dark">{q.content}</td>
                <td className="px-4 py-3 text-toss-gray600">{q.category}</td>
                <td className="px-4 py-3 text-center text-toss-gray600">{q.difficulty}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${q.isActive ? 'bg-green-100 text-toss-green' : 'bg-toss-gray100 text-toss-gray500'}`}>{q.isActive ? '활성' : '비활성'}</span>
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
        <div className="space-y-4">
          <Textarea label="문제 내용" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} />
          <Input label="카테고리" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="예: 거주지, 여가활동, 운동" />
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
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setModalOpen(false)}>취소</Button>
            <Button fullWidth onClick={handleSave}>저장</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
