import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import Link from 'next/link'
import { Icon } from '@iconify/react'

const ADMIN_NAV = [
  { href: '/admin', icon: 'solar:chart-square-bold-duotone', label: '대시보드', exact: true },
  { href: '/admin/questions', icon: 'solar:document-add-bold-duotone', label: '문제 관리' },
  { href: '/admin/criteria', icon: 'solar:settings-bold-duotone', label: '생성 기준' },
  { href: '/admin/posts', icon: 'solar:chat-square-bold-duotone', label: '게시글 관리' },
  { href: '/admin/resources', icon: 'solar:video-frame-bold-duotone', label: '자료 관리' },
  { href: '/admin/requests', icon: 'solar:letter-bold-duotone', label: '요청사항' },
  { href: '/admin/users', icon: 'solar:users-group-rounded-bold-duotone', label: '사용자 관리' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session || session.user?.role !== 'ADMIN') redirect('/')

  return (
    <div className="flex min-h-screen bg-toss-gray50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-toss-gray200 flex flex-col fixed top-0 left-0 h-full z-30">
        <div className="p-5 border-b border-toss-gray100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-toss-blue rounded-lg flex items-center justify-center text-white">
              <Icon icon="solar:mic-2-bold-duotone" className="text-sm" />
            </div>
            <div>
              <p className="font-bold text-sm text-toss-dark">OPIc Example</p>
              <p className="text-xs text-toss-gray500">관리자</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {ADMIN_NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-toss-gray700 hover:bg-toss-gray50 hover:text-toss-dark transition-colors"
            >
              <Icon icon={item.icon} className="text-lg text-toss-gray500" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-toss-gray100">
          <Link href="/" className="flex items-center gap-2 px-3 py-2 text-sm text-toss-gray500 hover:text-toss-dark">
            <Icon icon="solar:arrow-left-linear" />
            사이트로 돌아가기
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 p-8">{children}</main>
    </div>
  )
}
