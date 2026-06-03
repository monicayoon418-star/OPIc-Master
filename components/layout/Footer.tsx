import Link from 'next/link'
import { Icon } from '@iconify/react'

export default function Footer() {
  return (
    <footer className="bg-toss-gray50 border-t border-toss-gray200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start gap-12">

          {/* 로고 + 설명 */}
          <div className="min-w-[200px]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-toss-gray300 rounded-lg flex items-center justify-center text-white">
                <Icon icon="solar:mic-2-bold-duotone" className="text-sm" />
              </div>
              <span className="font-bold text-toss-gray800">OPIc Master</span>
            </div>
            <p className="text-sm text-toss-gray500 keep-all max-w-xs">
              AI를 활용한 유사 기출문제로 나만의 OPIc 예상 문제를 생성하세요.
            </p>
          </div>

          {/* 서비스 */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-toss-gray700">서비스</p>
            <Link href="/guide" className="block text-toss-gray500 hover:text-toss-dark">오픽 가이드</Link>
            <Link href="/exam" className="block text-toss-gray500 hover:text-toss-dark">문제 생성</Link>
            <Link href="/community" className="block text-toss-gray500 hover:text-toss-dark">시험 후기</Link>
            <Link href="/resources" className="block text-toss-gray500 hover:text-toss-dark">오픽 자료</Link>
          </div>

          {/* 고객지원 */}
          <div className="space-y-2 text-sm">
            <p className="font-semibold text-toss-gray700">고객지원</p>
            <Link href="/mypage/requests" className="block text-toss-gray500 hover:text-toss-dark">요청사항</Link>
            <Link href="/mypage" className="block text-toss-gray500 hover:text-toss-dark">마이페이지</Link>
          </div>

        </div>

        <p className="mt-8 text-xs text-toss-gray400 keep-all">
          본 서비스는 OPIc 공식 서비스와 무관한 독립 학습 플랫폼입니다. OPIc은 ACTFL이 개발하고 YBM이 운영하는 공인 영어 말하기 시험입니다.
        </p>

        <div className="mt-6 pt-6 border-t border-toss-gray200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-toss-gray400">
          <p>© 2026 OPIc Master. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-toss-gray600 font-semibold">개인정보처리방침</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
