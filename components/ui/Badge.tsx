import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'yellow' | 'red' | 'gray'
  className?: string
}

export default function Badge({ children, variant = 'gray', className }: BadgeProps) {
  const variants = {
    blue: 'bg-toss-blueLight text-toss-blue',
    green: 'bg-green-100 text-toss-green',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-toss-red',
    gray: 'bg-toss-gray100 text-toss-gray600',
  }
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold', variants[variant], className)}>
      {children}
    </span>
  )
}
