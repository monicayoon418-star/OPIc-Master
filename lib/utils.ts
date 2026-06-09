import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days < 7) return `${days}일 전`

  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatTableDate(dateStr: string) {
  const date = new Date(dateStr)
  const now = new Date()
  const isThisYear = date.getFullYear() === now.getFullYear()
  if (isThisYear) {
    return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
  }
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^#&?]+)/,
    /youtube\.com\/watch\?v=([^#&?]+)/,
    /youtube\.com\/embed\/([^#&?]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

export function getYoutubeThumbnail(url: string): string {
  const id = extractYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '/placeholder-video.png'
}

export function levelColor(level: string): string {
  const map: Record<string, string> = {
    AL: 'text-toss-blue bg-toss-blueLight',
    IH: 'text-purple-700 bg-purple-100',
    IM3: 'text-toss-green bg-green-100',
    IM2: 'text-toss-green bg-green-100',
    IM1: 'text-toss-green bg-green-100',
    IL: 'text-toss-yellow bg-yellow-100',
    NH: 'text-toss-red bg-red-100',
    NL: 'text-toss-red bg-red-100',
  }
  return map[level] ?? 'text-toss-gray600 bg-toss-gray100'
}
