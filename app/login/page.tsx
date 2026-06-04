'use client'

import { signIn } from 'next-auth/react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const next = searchParams.get('next') ?? '/'
  const [tab, setTab] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [age, setAge] = useState('')
  const [job, setJob] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await signIn('credentials', { email, password, redirect: false })
    setLoading(false)
    if (result?.error) setError('이메일 또는 비밀번호가 잘못되었습니다.')
    else router.push(next)
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nickname.trim() || !email.trim() || !password.trim()) { setError('모든 필드를 입력해주세요.'); return }
    setLoading(true)
    setError('')
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, nickname, age: age ? Number(age) : null, job: job || null }),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) { setError(data.error ?? '회원가입 실패'); return }
    await signIn('credentials', { email, password, callbackUrl: next })
  }

  const JOB_OPTIONS = [
    { value: 'STUDENT', label: '대학생' },
    { value: 'GRADUATE_STUDENT', label: '대학원생' },
    { value: 'JOB_SEEKER', label: '취준생' },
    { value: 'EMPLOYEE', label: '직장인' },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-toss-gray50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-toss-blue rounded-xl flex items-center justify-center text-white">
              <Icon icon="solar:mic-2-bold-duotone" className="text-lg" />
            </div>
            <span className="font-bold text-xl text-toss-dark">OPIc Example</span>
          </Link>
          <p className="text-toss-gray600 text-sm">계속하려면 로그인하세요</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_8px_32px_-8px_rgba(0,0,0,0.08)] border border-toss-gray100 p-8">
          {/* Tab */}
          <div className="flex bg-toss-gray50 rounded-xl p-1 mb-5">
            {(['login', 'signup'] as const).map(t => (
              <button key={t} onClick={() => { setTab(t); setError('') }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t ? 'bg-white text-toss-dark shadow-sm' : 'text-toss-gray500'}`}>
                {t === 'login' ? '로그인' : '회원가입'}
              </button>
            ))}
          </div>

          {tab === 'login' ? (
            <form onSubmit={handleEmailLogin} className="space-y-3">
              <Input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required />
              <Input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required />
              {error && <p className="text-xs text-toss-red">{error}</p>}
              <Button type="submit" fullWidth size="lg" loading={loading}>로그인</Button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-3">
              <Input placeholder="닉네임" value={nickname} onChange={e => setNickname(e.target.value)} required />
              <Input type="email" placeholder="이메일" value={email} onChange={e => setEmail(e.target.value)} required />
              <Input type="password" placeholder="비밀번호 (6자 이상)" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              <Input type="number" placeholder="나이 (선택)" value={age} onChange={e => setAge(e.target.value)} min={10} max={100} />
              <select value={job} onChange={e => setJob(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-toss-gray200 text-sm text-toss-gray700 focus:outline-none focus:ring-2 focus:ring-toss-blue/20 focus:border-toss-blue bg-white">
                <option value="">직업 선택 (선택)</option>
                {JOB_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {error && <p className="text-xs text-toss-red">{error}</p>}
              <Button type="submit" fullWidth size="lg" loading={loading}>회원가입</Button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-toss-gray400 mt-6">
          로그인 시 <Link href="#" className="underline">이용약관</Link> 및 <Link href="#" className="underline">개인정보처리방침</Link>에 동의합니다
        </p>
      </div>
    </div>
  )
}
