'use client'

import { useEffect, useState } from 'react'
import { Icon } from '@iconify/react'
import { getYoutubeThumbnail } from '@/lib/utils'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'

interface Resource { id: string; title: string; youtubeUrl: string; thumbnailUrl?: string | null; description?: string | null; tags: string[] }

export default function AdminResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Resource | null>(null)
  const [form, setForm] = useState({ title: '', youtubeUrl: '', description: '', tags: '' })

  useEffect(() => { fetch('/api/admin/resources').then(r => r.json()).then(d => setResources(d.data ?? [])) }, [])

  const openNew = () => { setEditing(null); setForm({ title: '', youtubeUrl: '', description: '', tags: '' }); setModalOpen(true) }
  const openEdit = (r: Resource) => { setEditing(r); setForm({ title: r.title, youtubeUrl: r.youtubeUrl, description: r.description ?? '', tags: r.tags.join(', ') }); setModalOpen(true) }

  const handleSave = async () => {
    const payload = { ...form, tags: form.tags.split(',').map(t => t.trim()).filter(Boolean) }
    const url = editing ? `/api/admin/resources/${editing.id}` : '/api/admin/resources'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    const r = await res.json()
    if (editing) setResources(prev => prev.map(p => p.id === r.id ? r : p))
    else setResources(prev => [r, ...prev])
    setModalOpen(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('삭제하시겠습니까?')) return
    await fetch(`/api/admin/resources/${id}`, { method: 'DELETE' })
    setResources(prev => prev.filter(r => r.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-toss-dark">자료 관리</h1>
        <Button onClick={openNew}><Icon icon="solar:add-circle-bold" className="mr-1.5" />자료 추가</Button>
      </div>

      <div className="grid gap-4">
        {resources.map(r => (
          <div key={r.id} className="flex gap-4 p-4 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-gray200">
            <img src={r.thumbnailUrl ?? getYoutubeThumbnail(r.youtubeUrl)} className="w-28 h-16 rounded-xl object-cover flex-shrink-0" alt={r.title} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-toss-dark truncate">{r.title}</p>
              <a href={r.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-toss-blue hover:underline truncate block">{r.youtubeUrl}</a>
              <div className="flex gap-1.5 mt-2">
                {r.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 bg-toss-blueLight text-toss-blue rounded-full">#{t}</span>)}
              </div>
            </div>
            <div className="flex gap-2 items-start">
              <button onClick={() => openEdit(r)} className="p-1.5 hover:bg-toss-gray100 rounded-lg text-toss-gray500"><Icon icon="solar:pen-bold" /></button>
              <button onClick={() => handleDelete(r.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-toss-gray500 hover:text-toss-red"><Icon icon="solar:trash-bin-2-bold" /></button>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? '자료 수정' : '자료 추가'}>
        <div className="space-y-4">
          <Input label="제목" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <Input label="유튜브 URL" value={form.youtubeUrl} onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))} placeholder="https://youtube.com/watch?v=..." />
          <Textarea label="설명" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
          <Input label="태그 (쉼표로 구분)" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} placeholder="유튜버명, 주제, ..." />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" fullWidth onClick={() => setModalOpen(false)}>취소</Button>
            <Button fullWidth onClick={handleSave}>저장</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
