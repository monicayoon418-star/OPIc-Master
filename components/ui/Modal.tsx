'use client'

import { useEffect } from 'react'
import { Icon } from '@iconify/react'
import { cn } from '@/lib/utils'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn('relative bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto', className)}>
        {title && (
          <div className="flex items-center justify-between px-6 py-5 border-b border-toss-gray100">
            <h2 className="text-lg font-bold text-toss-dark">{title}</h2>
            <button onClick={onClose} className="p-1.5 rounded-xl text-toss-gray400 hover:text-toss-dark hover:bg-toss-gray100 transition-colors">
              <Icon icon="solar:close-bold" className="text-xl" />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
