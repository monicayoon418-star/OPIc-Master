import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, className, ...props }, ref) => (
  <div className="space-y-1.5">
    {label && <label className="block text-sm font-semibold text-toss-gray700">{label}</label>}
    <input
      ref={ref}
      className={cn(
        'w-full px-4 py-3 rounded-2xl border border-toss-gray200 text-toss-dark placeholder:text-toss-gray400 bg-white',
        'focus:outline-none focus:ring-2 focus:ring-toss-blue/20 focus:border-toss-blue',
        'transition-colors text-sm',
        error && 'border-toss-red focus:ring-toss-red/20 focus:border-toss-red',
        className
      )}
      {...props}
    />
    {error && <p className="text-xs text-toss-red">{error}</p>}
  </div>
))

Input.displayName = 'Input'
export default Input
