export type Role = 'USER' | 'ADMIN'
export type Job = 'STUDENT' | 'GRADUATE_STUDENT' | 'JOB_SEEKER' | 'EMPLOYEE'
export type PostType = 'REVIEW' | 'STUDY'
export type RequestStatus = 'PENDING' | 'ANSWERED'

export interface User {
  id: string
  email?: string | null
  nickname: string
  age?: number | null
  job?: Job | null
  role: Role
  createdAt: string
}

export interface ExamQuestion {
  id: string
  content: string
  category: string
  session: 1 | 2
}

export interface ExamKeywords {
  occupation?: string
  isStudent?: boolean
  residence?: string
  leisure?: string[]
  hobbies?: string[]
  sports?: string[]
  vacation?: string[]
}

export interface GeneratedSet {
  id: string
  userId: string
  difficulty1: number
  difficulty2?: number | null
  targetLevel: string
  keywords: ExamKeywords
  questions: ExamQuestion[]
  createdAt: string
}

export interface Post {
  id: string
  userId: string
  user: Pick<User, 'id' | 'nickname'>
  type: PostType
  title: string
  content: string
  viewCount: number
  createdAt: string
  updatedAt: string
  _count?: { comments: number }
  isSaved?: boolean
}

export interface Comment {
  id: string
  postId: string
  userId: string
  user: Pick<User, 'id' | 'nickname'>
  content: string
  createdAt: string
  updatedAt: string
}

export interface Resource {
  id: string
  title: string
  youtubeUrl: string
  thumbnailUrl?: string | null
  description?: string | null
  tags: string[]
  createdAt: string
  isSaved?: boolean
}

export interface Request {
  id: string
  userId: string
  content: string
  response?: string | null
  status: RequestStatus
  createdAt: string
  respondedAt?: string | null
}

export interface AdminStats {
  dailySignups: { date: string; count: number }[]
  weeklySignups: { date: string; count: number }[]
  monthlySignups: { date: string; count: number }[]
  totalUsers: number
  totalGeneratedSets: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  hasMore: boolean
}

export const OCCUPATION_OPTIONS = [
  { value: '사업/회사', label: '사업/회사' },
  { value: '재택근무/재택사업', label: '재택근무/재택사업' },
  { value: '교사/교육자', label: '교사/교육자' },
  { value: '군복무', label: '군복무' },
  { value: '일 경험 없음', label: '일 경험 없음' },
]

export const RESIDENCE_OPTIONS = [
  { value: '개인 주택이나 아파트에 홀로 거주', label: '개인 주택/아파트 (1인)' },
  { value: '친구나 룸메이트와 함께 주택이나 아파트에 거주', label: '친구/룸메이트와 공동 거주' },
  { value: '가족과 함께 주택이나 아파트에 거주', label: '가족과 함께 거주' },
  { value: '학교 기숙사', label: '학교 기숙사' },
  { value: '군대 막사', label: '군대 막사' },
]

export const LEISURE_OPTIONS = [
  '영화보기', '해변가기', '당구치기', '요리 관련 프로그램 시청하기',
  '클럽/나이트클럽 가기', '스포츠 관람', '체스하기', '공연보기',
  '주거 개선', 'SNS에 글 올리기', '차로 드라이브하기', '콘서트보기',
  '술집/바에 가기', '친구들과 문자대화하기', '스파/마사지샵 가기',
  '박물관가기', '카페/커피전문점에 가기', '시험대비 과정 수강하기',
  '공원가기', '게임하기', '뉴스를 보거나 듣기', '자원봉사하기',
  '캠핑하기', 'TV시청하기', '쇼핑하기', '리얼리티 쇼 시청하기',
]

export const HOBBY_OPTIONS = [
  '아이에게 책 읽어주기', '혼자 노래부르거나 합창하기', '그림 그리기',
  '신문읽기', '음악 감상하기', '춤추기', '요리하기',
  '여행 관련 잡지나 블로그 읽기', '악기 연주하기', '애완동물 기르기',
  '독서', '글쓰기(편지, 단문, 시 등)', '주식 투자하기', '사진 촬영하기',
]

export const SPORT_OPTIONS = [
  '농구', '골프', '자전거', '하이킹/트레킹', '야구/소프트볼', '배구',
  '스키/스노우보드', '낚시', '축구', '테니스', '아이스 스케이트', '헬스',
  '미식축구', '배드민턴', '조깅', '태권도', '하키', '탁구', '걷기',
  '운동 수업 수강하기', '크리켓', '수영', '요가', '운동을 전혀 하지 않음',
]

export const VACATION_OPTIONS = [
  '국내 출장', '국내 여행', '집에서 보내는 휴가', '해외 출장', '해외여행',
]

export const OPIC_LEVELS = ['NL', 'NH', 'IL', 'IM1', 'IM2', 'IM3', 'IH', 'AL']
