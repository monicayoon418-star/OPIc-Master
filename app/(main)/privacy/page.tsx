export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-toss-dark mb-2">개인정보처리방침</h1>
      <p className="text-sm text-toss-gray500 mb-12">최종 수정일: 2026년 6월 3일</p>

      <div className="space-y-10 text-sm text-toss-gray700 leading-relaxed">

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">1. 수집하는 개인정보 항목</h2>
          <p className="mb-2">OPIc Master(이하 "서비스")는 회원가입 및 서비스 제공을 위해 아래의 개인정보를 수집합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-semibold">필수 항목:</span> 이메일 주소, 비밀번호(암호화 저장), 닉네임</li>
            <li><span className="font-semibold">선택 항목:</span> 나이, 직업</li>
            <li><span className="font-semibold">자동 수집:</span> 서비스 이용 기록(생성한 문제 세트, 저장 내역, 작성 게시글)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">2. 개인정보 수집 및 이용 목적</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 식별 및 서비스 이용 관리</li>
            <li>맞춤형 예상 문제 생성 (키워드·직업 정보 활용)</li>
            <li>게시글·댓글 등 커뮤니티 서비스 제공</li>
            <li>서비스 개선 및 운영에 관한 공지</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">3. 개인정보 보유 및 이용 기간</h2>
          <p className="mb-2">회원 탈퇴 즉시 해당 계정의 개인정보를 삭제합니다. 단, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 보관합니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>소비자 불만 또는 분쟁 처리에 관한 기록: 3년 (전자상거래법)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">4. 개인정보의 제3자 제공</h2>
          <p>서비스는 이용자의 개인정보를 원칙적으로 제3자에게 제공하지 않습니다. 다만, 이용자의 사전 동의가 있거나 법령에 의한 경우는 예외로 합니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">5. 개인정보 처리 위탁</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-semibold">Supabase Inc.</span> — 데이터베이스 저장 및 관리</li>
            <li><span className="font-semibold">Vercel Inc.</span> — 서비스 호스팅</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">6. 개인정보 파기 절차 및 방법</h2>
          <p>회원 탈퇴 시 이메일·닉네임을 임의값으로 대체하여 식별 불가 처리하며, 해당 정보를 복구할 수 없도록 조치합니다.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">7. 정보주체의 권리</h2>
          <p className="mb-2">이용자는 언제든지 아래의 권리를 행사할 수 있습니다.</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>개인정보 조회·수정: 마이페이지 &gt; 계정 설정</li>
            <li>회원 탈퇴(개인정보 삭제): 마이페이지 &gt; 계정 설정 &gt; 회원 탈퇴</li>
            <li>요청·문의: 마이페이지 &gt; 요청사항</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">8. 개인정보 보호책임자</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><span className="font-semibold">이메일:</span> monicayoon418@gmail.com</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-toss-dark mb-3">9. 방침 변경 시 공지</h2>
          <p>본 방침이 변경될 경우 서비스 내 공지사항을 통해 사전 안내합니다.</p>
        </section>

        <section className="p-5 bg-toss-gray50 rounded-2xl border border-toss-gray200">
          <h2 className="text-base font-bold text-toss-dark mb-2">면책 고지</h2>
          <p className="text-toss-gray600">
            OPIc Master는 OPIc 공식 서비스와 무관한 독립 학습 플랫폼입니다.
            OPIc(Oral Proficiency Interview by Computer)은 ACTFL이 개발하고 YBM이 한국 내 운영을 담당하는 공인 영어 말하기 시험입니다.
            본 서비스에서 제공하는 예상 문제는 AI를 활용하여 유사하게 생성된 학습용 문제이며, 실제 시험 문제와 동일하지 않습니다.
          </p>
        </section>

      </div>
    </div>
  )
}
