import { Icon } from '@iconify/react'
import Badge from '@/components/ui/Badge'

const GUIDE_ITEMS = [
  {
    icon: 'solar:clock-circle-bold-duotone',
    title: '시험 진행 시간',
    content: [
      '총 약 60분 (오리엔테이션 20분 + 본 시험 40분)',
      '오리엔테이션: 마이크 테스트, 배경 설문 등',
      '본 시험: 40분 내 전체 문항 답변 완료',
    ],
  },
  {
    icon: 'solar:document-bold-duotone',
    title: '문제 수 & 구성',
    content: [
      '난이도 1~2 선택 시: 12문제',
      '난이도 3~6 선택 시: 15문제',
      '1차 세션 7문제 후 2차 난이도 재선택',
    ],
  },
  {
    icon: 'solar:mic-bold-duotone',
    title: '답변 방법',
    content: [
      '본 시험 40분 내 모든 문제 답변',
      '문제별 제한 시간 없음',
      '권장 답변 시간: 문항당 약 2분',
      '더 짧거나 길게 답변 가능',
    ],
  },
  {
    icon: 'solar:global-bold-duotone',
    title: '시험 접수',
    content: [
      '온라인 전용 접수 (www.opic.or.kr)',
      '접수 일정 및 시험 정보 공식 사이트 확인',
      '추가 비용으로 세부 진단서 신청 가능',
    ],
  },
  {
    icon: 'solar:diploma-bold-duotone',
    title: '성적 확인',
    content: [
      '응시일로부터 7일 후 온라인 조회',
      '온라인으로만 성적 확인 가능',
      '세부 진단서: 항목별 진단표 + 평가자 코멘트',
    ],
  },
  {
    icon: 'solar:star-bold-duotone',
    title: '등급 체계',
    content: [
      'AL > IH > IM3 > IM2 > IM1 > IL > NH > NL',
      '취업 최소 기준: IM2 이상 (기업별 상이)',
      '공기업/대기업 권장: IH 이상',
    ],
  },
]

const LEVEL_INFO = [
  { level: 'AL', desc: '최고 등급. 원어민에 가까운 수준의 영어 사용 가능', color: 'bg-toss-blue text-white' },
  { level: 'IH', desc: '고급. 복잡한 주제도 자신 있게 말할 수 있음', color: 'bg-toss-dark text-white' },
  { level: 'IM3', desc: '중상급. 다양한 주제를 비교적 유창하게 설명', color: 'bg-white border-2 border-toss-green text-toss-green' },
  { level: 'IM2', desc: '중급. 일상적인 주제 대화 가능', color: 'bg-white border-2 border-toss-green text-toss-green' },
  { level: 'IM1', desc: '중하급. 간단한 일상 대화 가능', color: 'bg-white border border-toss-gray200 text-toss-gray700' },
  { level: 'IL', desc: '초중급. 단순한 문장 구사 가능', color: 'bg-white border border-toss-gray200 text-toss-gray700' },
  { level: 'NH', desc: '초급. 매우 기초적인 수준', color: 'bg-white border border-toss-gray200 text-toss-gray500' },
  { level: 'NL', desc: '최하 등급', color: 'bg-white border border-toss-gray200 text-toss-gray500' },
]

export default function GuidePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3 text-toss-dark">오픽 처음이세요?</h1>
        <p className="text-lg text-toss-gray600 keep-all">
          OPIc(Oral Proficiency Interview by Computer) 시험에 대한 모든 정보를 확인하세요.
        </p>
      </div>

      {/* Key Info Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
        {GUIDE_ITEMS.map((item, i) => (
          <div key={i} className="bg-toss-gray50 rounded-3xl p-6 border border-toss-gray100 hover:border-toss-blue/20 transition-colors">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-toss-gray100">
              <Icon icon={item.icon} className="text-2xl text-toss-blue" />
            </div>
            <h3 className="font-bold text-toss-dark mb-3">{item.title}</h3>
            <ul className="space-y-1.5">
              {item.content.map((c, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-toss-gray600">
                  <Icon icon="solar:check-circle-bold" className="text-toss-green flex-shrink-0 mt-0.5" />
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Levels */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-2 text-toss-dark">등급 체계 상세 안내</h2>
        <p className="text-toss-gray600 mb-8">OPIc 등급은 총 8단계로 구성됩니다.</p>
        <div className="space-y-3">
          {LEVEL_INFO.map((item) => (
            <div key={item.level} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-toss-gray100 hover:border-toss-gray200 transition-colors">
              <div className={`w-16 h-12 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${item.color}`}>
                {item.level}
              </div>
              <p className="text-sm text-toss-gray700">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Process */}
      <div className="bg-toss-blueLight rounded-3xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Icon icon="solar:info-circle-bold-duotone" className="text-2xl text-toss-blue" />
          <h2 className="text-xl font-bold text-toss-dark">시험 진행 순서</h2>
        </div>
        <div className="space-y-4">
          {[
            { step: '1', title: '배경 설문', desc: '직업, 거주지, 취미 등 12개 이상 키워드 선택' },
            { step: '2', title: '1차 난이도 선택', desc: '1~6 중 본인의 수준에 맞는 난이도 선택' },
            { step: '3', title: '1차 세션 (7문제)', desc: '자기소개 포함 7문제 음성 답변' },
            { step: '4', title: '2차 난이도 재선택', desc: '1차 세션 후 난이도를 다시 조정' },
            { step: '5', title: '2차 세션 (5~8문제)', desc: '선택 난이도에 따라 5문제(1~2단계) 또는 8문제(3~6단계)' },
            { step: '6', title: '시험 종료', desc: '40분 경과 또는 전체 완료 시 자동 종료' },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-toss-blue rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{s.step}</div>
              <div>
                <p className="font-semibold text-toss-dark text-sm">{s.title}</p>
                <p className="text-sm text-toss-gray600">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
