'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Icon } from '@iconify/react'

export default function WriteButton() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-toss-blue text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-toss-blueHover transition-colors"
      >
        <Icon icon="solar:pen-bold" />
        글쓰기
        <Icon icon={open ? 'solar:alt-arrow-up-bold' : 'solar:alt-arrow-down-bold'} className="text-xs" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-white border border-toss-gray100 rounded-2xl shadow-lg overflow-hidden z-20">
          <button
            onClick={() => { router.push('/community/reviews/new'); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-toss-dark hover:bg-toss-gray50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-toss-blue flex-shrink-0" />
            시험 후기 작성
          </button>
          <button
            onClick={() => { router.push('/community/study-tips/new'); setOpen(false) }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-toss-dark hover:bg-toss-gray50 transition-colors border-t border-toss-gray100"
          >
            <span className="w-2 h-2 rounded-full bg-toss-green flex-shrink-0" />
            공부꿀팁 작성
          </button>
        </div>
      )}
    </div>
  )
}
