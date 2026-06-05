'use client'

import { useEffect, useState, useMemo } from 'react'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'
import {
  OCCUPATION_OPTIONS, RESIDENCE_OPTIONS, LEISURE_OPTIONS,
  HOBBY_OPTIONS, SPORT_OPTIONS, VACATION_OPTIONS,
} from '@/types'

interface Combo { id: string; name: string; keyword: string; questions: Question[] }
interface Question {
  id: string; content: string; category: string; difficulty: number[]; keywords: string[]
  isActive: boolean; comboId?: string | null; comboOrder?: number | null
  positionStart?: number | null; positionEnd?: number | null
  combo?: { id: string; name: string; keyword: string } | null
}

const KEYWORD_GROUPS = [
  { label: '직업/학업', options: OCCUPATION_OPTIONS.map(o => o.value) },
  { label: '거주지', options: RESIDENCE_OPTIONS.map(o => o.value) },
  { label: '여가 활동', options: LEISURE_OPTIONS },
  { label: '취미/관심사', options: HOBBY_OPTIONS },
  { label: '운동', options: SPORT_OPTIONS },
  { label: '휴가/출장', options: VACATION_OPTIONS },
]
const PRESET_CATEGORIES = ['자기소개', '거주지', '여가활동', '취미', '운동', '여행', '직업', '롤플레이', '돌발']
const ALL_DIFFICULTIES = [1, 2, 3, 4, 5, 6]

export default function QuestionsAdmin() {
  const [tab, setTab] = useState<'questions' | 'combos'>('questions')
  const [questions, setQuestions] = useState<Question[]>([])
  const [combos, setCombos] = useState<Combo[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [comboModalOpen, setComboModalOpen] = useState(false)
  const [editingCombo, setEditingCombo] = useState<Combo | null>(null)
  const [editing, setEditing] = useState<Question | null>(null)
  const [form, setForm] = useState({
    content: '', category: '', difficulty: [] as number[],
    keywords: [] as string[], comboId: '', comboOrder: '',
    newComboName: '', newComboKeyword: '',
    positionStart: '', positionEnd: '',
  })
  const [comboForm, setComboForm] = useState({ name: '', keyword: '' })
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('전체')
  const [comboCatFilter, setComboCatFilter] = useState('전체')

  const loadAll = () => {
    fetch('/api/admin/questions').then(r => r.json()).then(d => setQuestions(d.data ?? []))
    fetch('/api/admin/combos').then(r => r.json()).then(d => setCombos(d.data ?? []))
  }
  useEffect(() => { loadAll() }, [])

  // 현재 등록된 카테고리 목록 (프리셋 + 커스텀, 중복 제거)
  const allCategories = useMemo(() => {
    const fromQuestions = questions.map(q => q.category).filter(Boolean)
    return ['전체', ...Array.from(new Set([...PRESET_CATEGORIES, ...fromQuestions]))]
  }, [questions])

  // 콤보 탭용 카테고리 목록 (콤보 내 문제 기준)
  const comboCatOptions = useMemo(() => {
    const cats = combos.flatMap(c => c.questions.map(q => q.category)).filter(Boolean)
    return ['전체', ...Array.from(new Set(cats))]
  }, [combos])

  const openNew = () => {
    setEditing(null)
    setForm({ content: '', category: '', difficulty: [], keywords: [], comboId: '', comboOrder: '', newComboName: '', newComboKeyword: '', positionStart: '', positionEnd: '' })
    setModalOpen(true)
  }
  const openEdit = (q: Question) => {
    setEditing(q)
    setForm({
      content: q.content, category: q.category,
      difficulty: q.difficulty ?? [],
      keywords: q.keywords ?? [],
      comboId: q.comboId ?? '',
      comboOrder: q.comboOrder?.toString() ?? '',
      newComboName: '', newComboKeyword: '',
      positionStart: q.positionStart?.toString() ?? '',
      positionEnd: q.positionEnd?.toString() ?? '',
    })
    setModalOpen(true)
  }

  const toggleDifficulty = (d: number) =>
    setForm(f => ({ ...f, difficulty: f.difficulty.includes(d) ? f.difficulty.filter(x => x !== d) : [...f.difficulty, d].sort() }))

  const toggleKeyword = (kw: string) =>
    setForm(f => ({ ...f, keywords: f.keywords.includes(kw) ? f.keywords.filter(k => k !== kw) : [...f.keywords, kw] }))

  const handleSave = async () => {
    let resolvedComboId = form.comboId || null
    if (form.comboId === '__new__') {
      if (!form.newComboName || !form.newComboKeyword) return
      const res = await fetch('/api/admin/combos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.newComboName, keyword: form.newComboKeyword }),
      })
      const newCombo = await res.json()
      resolvedComboId = newCombo.id
    }

    const payload = {
      content: form.content, category: form.category,
      difficulty: form.difficulty, keywords: form.keywords,
      comboId: resolvedComboId,
      comboOrder: form.comboOrder ? Number(form.comboOrder) : null,
      positionStart: form.positionStart ? Number(form.positionStart) : null,
      positionEnd: form.positionEnd ? Number(form.positionEnd) : null,
    }
    const url = editing ? `/api/admin/questions/${editing.id}` : '/api/admin/questions'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const q = await res.json()
    if (editing) setQuestions(prev => prev.map(p => p.id === q.id ? q : p))
    else setQuestions(prev => [q, ...prev])
    loadAll()
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('문제를 삭제하시겠습니까?')) return
    await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' })
    setQuestions(prev => prev.filter(q => q.id !== id))
  }

  const openNewCombo = () => { setEditingCombo(null); setComboForm({ name: '', keyword: '' }); setComboModalOpen(true) }
  const openEditCombo = (c: Combo) => { setEditingCombo(c); setComboForm({ name: c.name, keyword: c.keyword }); setComboModalOpen(true) }

  const handleSaveCombo = async () => {
    if (!comboForm.name || !comboForm.keyword) return
    const url = editingCombo ? `/api/admin/combos/${editingCombo.id}` : '/api/admin/combos'
    const method = editingCombo ? 'PATCH' : 'POST'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(comboForm) })
    loadAll()
    setComboModalOpen(false)
  }

  const handleDeleteCombo = async (id: string) => {
    if (!confirm('콤보를 삭제하면 소속 문제들의 콤보 설정이 해제됩니다. 계속하시겠습니까?')) return
    await fetch(`/api/admin/combos/${id}`, { method: 'DELETE' })
    loadAll()
  }

  const filtered = questions.filter(q =>
    (catFilter === '전체' || q.category === catFilter) &&
    (q.content.includes(search) || q.category.includes(search))
  )

  const filteredCombos = combos.filter(c =>
    comboCatFilter === '전체' || c.questions.some(q => q.category === comboCatFilter)
  )

  const FilterChips = ({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) => (
    <div className="flex flex-wrap gap-1.5 mb-4">
      {options.map(cat => (
        <button key={cat} onClick={() => onChange(cat)}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${value === cat ? 'bg-toss-blue text-white' : 'bg-toss-gray100 text-toss-gray600 hover:bg-toss-gray200'}`}>
          {cat}
        </button>
      ))}
    </div>
  )

  const showComboOrder = form.comboId && form.comboId !== '__new__'
  const showNewComboInputs = form.comboId === '__new__'
  const showOrderForNew = form.comboId === '__new__'

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-toss-dark">문제 관리</h1>
        <div className="flex gap-2">
          {tab === 'questions' && <Button onClick={openNew}><Icon icon="solar:add-circle-bold" className="mr-1.5" />문제 추가</Button>}
          {tab === 'combos' && <Button onClick={openNewCombo}><Icon icon="solar:add-circle-bold" className="mr-1.5" />콤보 추가</Button>}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex gap-2 mb-5">
        {(['questions', 'combos'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === t ? 'bg-toss-blue text-white' : 'bg-toss-gray100 text-toss-gray600 hover:bg-toss-gray200'}`}>
            {t === 'questions' ? `문제 목록 (${questions.length})` : `콤보 관리 (${combos.length})`}
          </button>
        ))}
      </div>

      {tab === 'questions' && (
        <>
          <div className="flex items-start gap-2 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-xs text-yellow-800 mb-4">
            <Icon icon="solar:danger-triangle-bold" className="flex-shrink-0 mt-0.5 text-yellow-600" />
            <p><span className="font-semibold">저작권 주의:</span> 실제 OPIc 기출 문제를 그대로 등록하지 마세요. 반드시 표현을 변경하거나 유사하게 재작성한 문제만 등록해 주세요.</p>
          </div>

          {/* 카테고리 필터 */}
          <FilterChips options={allCategories} value={catFilter} onChange={setCatFilter} />

          <div className="bg-white rounded-2xl border border-toss-gray100 overflow-hidden">
            <div className="p-4 border-b border-toss-gray100">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="문제 검색..." className="w-full px-4 py-2 rounded-xl border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20" />
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-toss-gray50 text-toss-gray600">
                  <th className="text-left px-5 py-3 font-semibold">문제 내용</th>
                  <th className="text-left px-4 py-3 font-semibold w-24">카테고리</th>
                  <th className="text-center px-4 py-3 font-semibold w-20">난이도</th>
                  <th className="text-left px-4 py-3 font-semibold w-32">콤보/타입</th>
                  <th className="text-center px-4 py-3 font-semibold w-20">위치</th>
                  <th className="w-20 px-4" />
                </tr>
              </thead>
              <tbody className="divide-y divide-toss-gray100">
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-toss-gray400">해당 카테고리의 문제가 없습니다.</td></tr>
                ) : filtered.map(q => (
                  <tr key={q.id} className="hover:bg-toss-gray50/50">
                    <td className="px-5 py-3 text-toss-dark max-w-xs truncate">{q.content}</td>
                    <td className="px-4 py-3 text-toss-gray600">{q.category}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1 flex-wrap">
                        {(q.difficulty ?? []).map(d => (
                          <span key={d} className="text-xs px-1.5 py-0.5 bg-toss-blueLight text-toss-blue rounded font-bold">{d}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="flex flex-col gap-1">
                        {q.category === '돌발' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full font-semibold w-fit">
                            <Icon icon="solar:danger-triangle-bold" className="text-xs" />돌발
                          </span>
                        )}
                        {q.combo ? (
                          <span className="inline-flex items-center gap-1 text-toss-gray600">
                            <Icon icon="solar:layers-bold" className="text-toss-blue shrink-0" />
                            <span className="truncate max-w-[80px]">{q.combo.name}</span>
                            <span className="text-toss-gray400 shrink-0">#{q.comboOrder}</span>
                          </span>
                        ) : q.category !== '돌발' && (
                          <span className="text-toss-gray300">-</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {q.positionStart != null ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                          <Icon icon="solar:map-point-bold" className="text-xs" />
                          {q.positionStart}{q.positionEnd && q.positionEnd !== q.positionStart ? `–${q.positionEnd}` : ''}번
                        </span>
                      ) : (
                        <span className="text-toss-gray300 text-xs">-</span>
                      )}
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
        </>
      )}

      {tab === 'combos' && (
        <>
          {/* 콤보 탭 카테고리 필터 */}
          {comboCatOptions.length > 1 && (
            <FilterChips options={comboCatOptions} value={comboCatFilter} onChange={setComboCatFilter} />
          )}

          <div className="space-y-4">
            {filteredCombos.length === 0 ? (
              <div className="text-center py-16 text-toss-gray400">
                <Icon icon="solar:layers-bold-duotone" className="text-4xl mx-auto mb-3 block text-toss-gray300" />
                <p>{combos.length === 0 ? '등록된 콤보가 없습니다.' : '해당 카테고리의 콤보가 없습니다.'}</p>
              </div>
            ) : filteredCombos.map(combo => (
              <div key={combo.id} className="bg-white border border-toss-gray200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="font-bold text-toss-dark">{combo.name}</span>
                    <span className="ml-2 text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full font-medium">{combo.keyword}</span>
                    <span className="ml-2 text-xs text-toss-gray500">{combo.questions.length}개 문제</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditCombo(combo)} className="p-1.5 hover:bg-toss-gray100 rounded-lg text-toss-gray500"><Icon icon="solar:pen-bold" /></button>
                    <button onClick={() => handleDeleteCombo(combo.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-toss-gray500 hover:text-toss-red"><Icon icon="solar:trash-bin-2-bold" /></button>
                  </div>
                </div>
                <div className="space-y-2">
                  {combo.questions.map(q => (
                    <div key={q.id} className="flex items-start gap-3 p-3 bg-toss-gray50 rounded-xl text-sm">
                      <span className="shrink-0 w-6 h-6 bg-toss-blue text-white rounded-full flex items-center justify-center text-xs font-bold">{q.comboOrder}</span>
                      <span className="text-toss-gray700 flex-1">{q.content}</span>
                      <span className="shrink-0 text-xs text-toss-gray400">{q.category}</span>
                    </div>
                  ))}
                  {combo.questions.length === 0 && (
                    <p className="text-xs text-toss-gray400 pl-1">아직 소속 문제가 없습니다. 문제 등록 시 이 콤보를 선택하세요.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 문제 추가/수정 모달 */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '문제 수정' : '문제 추가'}>
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <Textarea label="문제 내용" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={3} />

          {/* 카테고리: 프리셋 버튼 + 직접 입력 */}
          <div>
            <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">카테고리</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESET_CATEGORIES.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, category: c }))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${form.category === c ? 'bg-toss-blue text-white border-toss-blue' : 'bg-white text-toss-gray700 border-toss-gray200 hover:border-toss-blue/50'}`}>
                  {c}
                </button>
              ))}
            </div>
            <input
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
              placeholder="위에서 선택하거나 직접 입력 (예: 집 묘사, 가게 묘사)"
              className="w-full px-4 py-2.5 rounded-xl border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">
              난이도 <span className="text-toss-gray400 font-normal text-xs">(복수 선택 가능)</span>
            </label>
            <div className="flex gap-2">
              {ALL_DIFFICULTIES.map(d => (
                <button key={d} onClick={() => toggleDifficulty(d)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${form.difficulty.includes(d) ? 'bg-toss-blue text-white border-toss-blue' : 'bg-toss-gray50 text-toss-gray600 hover:bg-toss-gray100 border-transparent'}`}>
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

          {/* 콤보 설정 */}
          <div>
              <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">
                콤보 설정 <span className="text-toss-gray400 font-normal text-xs">(선택사항)</span>
              </label>
              <div className="space-y-2">
                <select
                  value={form.comboId}
                  onChange={e => setForm(f => ({ ...f, comboId: e.target.value, newComboName: '', newComboKeyword: '' }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20"
                >
                  <option value="">콤보 없음 (단독 문제)</option>
                  {combos.map(c => <option key={c.id} value={c.id}>{c.name} ({c.keyword})</option>)}
                  <option value="__new__">＋ 새 콤보 만들기</option>
                </select>

                {showNewComboInputs && (
                  <div className="p-3 bg-toss-blueLight rounded-xl space-y-2">
                    <input value={form.newComboName} onChange={e => setForm(f => ({ ...f, newComboName: e.target.value }))}
                      placeholder="콤보 이름 (예: 영화보기 콤보)"
                      className="w-full px-3 py-2 rounded-lg border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20 bg-white" />
                    <input value={form.newComboKeyword} onChange={e => setForm(f => ({ ...f, newComboKeyword: e.target.value }))}
                      placeholder="대표 키워드 (예: 영화보기)"
                      className="w-full px-3 py-2 rounded-lg border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20 bg-white" />
                  </div>
                )}

                {(showComboOrder || showOrderForNew) && (
                  <div>
                    <label className="block text-xs text-toss-gray600 mb-1">콤보 내 순서 (1–3)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3].map(n => (
                        <button key={n} onClick={() => setForm(f => ({ ...f, comboOrder: String(n) }))}
                          className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${form.comboOrder === String(n) ? 'bg-toss-blue text-white border-toss-blue' : 'bg-toss-gray50 text-toss-gray600 border-transparent'}`}>
                          {n}번째
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {form.category === '돌발' && (
                <div className="flex items-center gap-2 px-3 py-2.5 bg-orange-50 rounded-xl text-xs text-orange-700">
                  <Icon icon="solar:danger-triangle-bold" className="text-orange-500" />
                  돌발 문제는 콤보로 묶어 2–3개 연속 출제할 수 있습니다.
                </div>
              )}
          </div>
          {/* 출제 위치 고정 */}
          <div>
            <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">
              출제 위치 <span className="text-toss-gray400 font-normal text-xs">(선택사항 · 1–15번)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number" min={1} max={15}
                value={form.positionStart}
                onChange={e => setForm(f => ({ ...f, positionStart: e.target.value }))}
                placeholder="시작"
                className="w-full px-3 py-2 rounded-xl border border-toss-gray200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-toss-blue/20"
              />
              <span className="text-toss-gray400 shrink-0 text-sm">~</span>
              <input
                type="number" min={1} max={15}
                value={form.positionEnd}
                onChange={e => setForm(f => ({ ...f, positionEnd: e.target.value }))}
                placeholder="끝"
                className="w-full px-3 py-2 rounded-xl border border-toss-gray200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-toss-blue/20"
              />
            </div>
            <p className="text-xs text-toss-gray400 mt-1.5">예) 자기소개: 1~1 / 롤플레이: 12~15. 비워두면 무작위 배치.</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setModalOpen(false)}>취소</Button>
            <Button fullWidth onClick={handleSave} disabled={!form.content || !form.category || form.difficulty.length === 0}>저장</Button>
          </div>
        </div>
      </Modal>

      {/* 콤보 추가/수정 모달 */}
      <Modal open={comboModalOpen} onClose={() => setComboModalOpen(false)} title={editingCombo ? '콤보 수정' : '콤보 추가'}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">콤보 이름</label>
            <input value={comboForm.name} onChange={e => setComboForm(f => ({ ...f, name: e.target.value }))}
              placeholder="예: 영화보기 콤보"
              className="w-full px-4 py-2.5 rounded-xl border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-toss-gray700 mb-1.5">대표 키워드</label>
            <input value={comboForm.keyword} onChange={e => setComboForm(f => ({ ...f, keyword: e.target.value }))}
              placeholder="예: 영화보기"
              className="w-full px-4 py-2.5 rounded-xl border border-toss-gray200 text-sm focus:outline-none focus:ring-2 focus:ring-toss-blue/20" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setComboModalOpen(false)}>취소</Button>
            <Button fullWidth onClick={handleSaveCombo} disabled={!comboForm.name || !comboForm.keyword}>저장</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
