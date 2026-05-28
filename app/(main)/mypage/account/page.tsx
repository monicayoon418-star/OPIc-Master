'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icon } from '@iconify/react'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Textarea from '@/components/ui/Textarea'

export default function AccountPage() {
  const router = useRouter()
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const handleWithdraw = async () => {
    if (!reason.trim()) return
    setLoading(true)
    await fetch('/api/auth/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    await signOut({ redirect: false })
    router.push('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/mypage" className="text-toss-gray500 hover:text-toss-dark"><Icon icon="solar:arrow-left-linear" /></Link>
        <h1 className="text-2xl font-bold text-toss-dark">계정 설정</h1>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full flex items-center justify-between p-5 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-gray200 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon icon="solar:logout-2-bold-duotone" className="text-xl text-toss-gray600" />
            <span className="font-semibold text-toss-dark">로그아웃</span>
          </div>
          <Icon icon="solar:arrow-right-linear" className="text-toss-gray400" />
        </button>

        <button
          onClick={() => setWithdrawModal(true)}
          className="w-full flex items-center justify-between p-5 bg-white border border-toss-gray100 rounded-2xl hover:border-toss-red/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon icon="solar:trash-bin-2-bold-duotone" className="text-xl text-toss-red" />
            <span className="font-semibold text-toss-red">회원 탈퇴</span>
          </div>
          <Icon icon="solar:arrow-right-linear" className="text-toss-gray400" />
        </button>
      </div>

      <Modal open={withdrawModal} onClose={() => setWithdrawModal(false)} title="회원 탈퇴">
        <div className="space-y-4">
          <div className="bg-red-50 rounded-2xl p-4">
            <p className="text-sm text-toss-red font-semibold mb-1">탈퇴 시 주의사항</p>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• 계정 정보가 즉시 삭제됩니다</li>
              <li>• 시험 내역, 저장 글, 작성 게시글이 모두 삭제됩니다</li>
              <li>• 탈퇴 후 복구가 불가능합니다</li>
            </ul>
          </div>
          <Textarea
            label="탈퇴 사유 (필수)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            rows={3}
            placeholder="탈퇴하시는 이유를 알려주세요."
          />
          <div className="flex gap-3">
            <Button variant="secondary" fullWidth onClick={() => setWithdrawModal(false)}>취소</Button>
            <Button variant="danger" fullWidth loading={loading} disabled={!reason.trim()} onClick={handleWithdraw}>탈퇴하기</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
