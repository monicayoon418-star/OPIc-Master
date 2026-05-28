'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icon } from '@iconify/react'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

const NAV_ITEMS = [
  { href: '/guide', label: '오픽 가이드' },
  { href: '/exam', label: '모의고사' },
  { href: '/community', label: '커뮤니티' },
  { href: '/resources', label: '오픽 자료' },
]

export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-toss-gray200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex-shrink-0">
            <span className="font-bold text-lg tracking-tight text-toss-dark">OPIc Master</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-base font-semibold transition-all hover:text-lg hover:font-bold ${
                  pathname.startsWith(item.href)
                    ? 'text-toss-blue'
                    : 'text-toss-gray700 hover:text-toss-dark'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <>
                {session.user?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-base font-semibold text-toss-gray600 hover:text-toss-dark">
                    관리자
                  </Link>
                )}
                <Link href="/mypage" className="text-base font-semibold text-toss-gray600 hover:text-toss-dark">
                  마이페이지
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-base font-semibold text-toss-gray500 hover:text-toss-dark"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <Link href="/login" className="text-base font-semibold text-toss-gray700 hover:text-toss-dark transition-colors">
                로그인
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-xl text-toss-gray600"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon icon={menuOpen ? 'solar:close-bold' : 'solar:hamburger-menu-bold'} className="text-xl" />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-toss-gray100 bg-white/90 backdrop-blur-md rounded-2xl mt-1 space-y-1 px-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${
                  pathname.startsWith(item.href)
                    ? 'text-toss-blue'
                    : 'text-toss-gray700 hover:bg-toss-gray50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-toss-gray100">
              {session ? (
                <>
                  <Link href="/mypage" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-semibold text-toss-gray700 hover:bg-toss-gray50 rounded-xl">마이페이지</Link>
                  <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left px-4 py-3 text-base font-semibold text-toss-gray500 hover:bg-toss-gray50 rounded-xl">로그아웃</button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-base font-semibold text-toss-blue hover:bg-toss-blueLight rounded-xl">로그인</Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
