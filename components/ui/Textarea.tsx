import { TextareaHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-toss-gray700">{label}</label>}
    <textarea
      ref={ref}
      className={cn(
        'w-full px-4 py-3 rounded-2xl border border-toss-gray200 text-toss-dark placeholder:text-toss-gray400 bg-white',
        'focus:outline-none focus:ring-2 focus:ring-toss-blue/20 focus:border-toss-blue',
        'transition-colors text-sm resize-none',
        error && 'border-toss-red',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-toss-red">{error}</p>}
  </div>
))

Textarea.displayName = 'Textarea'
export default Textarea
