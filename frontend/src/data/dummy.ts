// User data
export const userData = {
  nickname: '꿈꾸는개발자',
  level: 3,
  exp: 65,
  maxExp: 100,
  career: 'AI 개발자',
  interests: ['인공지능', '머신러닝', '데이터분석'],
  goal: '2025년 AI 스타트업 취업',
  badges: [
    { id: 1, name: '첫 진로 탐색', icon: '🎯', date: '2024.01.15' },
    { id: 2, name: '로드맵 마스터', icon: '🗺️', date: '2024.02.01' },
    { id: 3, name: '정보 수집가', icon: '📚', date: '2024.02.20' },
    { id: 4, name: '커뮤니티 활동', icon: '💬', date: '2024.03.05' },
  ],
  recentActivities: [
    { id: 1, action: '시뮬레이션 완료', detail: '복수전공 vs 인턴', exp: 15, date: '오늘' },
    { id: 2, action: '정보 저장', detail: 'AI 공모전 정보', exp: 5, date: '어제' },
    { id: 3, action: '게시글 작성', detail: '인턴 준비 팁 공유', exp: 10, date: '2일 전' },
  ],
  savedItems: [
    { id: 1, title: 'AI 개발자 인턴십', category: '인턴', deadline: '2024.04.30' },
    { id: 2, title: '정보처리기사', category: '자격증', deadline: '2024.05.15' },
  ],
}

// Career options for onboarding
export const careerOptions = [
  { id: 'ai', name: 'AI 개발자', icon: '🤖', color: 'bg-sky-medium' },
  { id: 'designer', name: '디자이너', icon: '🎨', color: 'bg-peach' },
  { id: 'semiconductor', name: '반도체', icon: '💾', color: 'bg-lavender' },
  { id: 'marketing', name: '마케터', icon: '📊', color: 'bg-mint' },
  { id: 'finance', name: '금융/회계', icon: '💰', color: 'bg-peach' },
  { id: 'other', name: '기타', icon: '✨', color: 'bg-sky-medium' },
]

// Info page data
export const infoCategories = ['전체', '자격증', '인턴', '공모전', '시험']

export const infoItems = [
  {
    id: 1,
    title: 'AI 스타트업 인턴십 모집',
    category: '인턴',
    deadline: '2024.04.30',
    daysLeft: 14,
    fields: ['AI', '머신러닝'],
    description: 'AI 기반 서비스 개발 인턴 모집',
    saved: false,
  },
  {
    id: 2,
    title: '정보처리기사 실기시험',
    category: '자격증',
    deadline: '2024.05.15',
    daysLeft: 29,
    fields: ['IT', '소프트웨어'],
    description: '2024년 2회 정보처리기사 실기',
    saved: true,
  },
  {
    id: 3,
    title: 'AI 아이디어 공모전',
    category: '공모전',
    deadline: '2024.04.20',
    daysLeft: 4,
    fields: ['AI', '창업'],
    description: '대학생 AI 서비스 아이디어 공모',
    saved: false,
  },
  {
    id: 4,
    title: 'SQLD 자격증 시험',
    category: '자격증',
    deadline: '2024.06.01',
    daysLeft: 46,
    fields: ['데이터베이스', 'SQL'],
    description: 'SQL 개발자 자격증 시험',
    saved: false,
  },
  {
    id: 5,
    title: '네이버 부스트캠프',
    category: '인턴',
    deadline: '2024.05.10',
    daysLeft: 24,
    fields: ['웹개발', 'AI'],
    description: '네이버 커넥트재단 부스트캠프 모집',
    saved: true,
  },
]

// Community posts
export const communityPosts = [
  {
    id: 1,
    title: 'AI 인턴 준비 어떻게 시작하면 좋을까요?',
    content: '비전공자인데 AI 분야 인턴십을 준비하고 싶습니다. 어떤 것부터 시작해야 할지 조언 부탁드립니다.',
    tags: ['AI', '인턴', '비전공자'],
    author: '열정적인취준생',
    date: '2024.04.16',
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    title: '복수전공 고민 중입니다',
    content: '컴퓨터공학과인데 경영학 복수전공 할지 고민입니다. 취업에 도움이 될까요?',
    tags: ['복수전공', '진로고민'],
    author: '고민많은대학생',
    date: '2024.04.15',
    likes: 18,
    comments: 12,
  },
  {
    id: 3,
    title: '공모전 팀원 구하는 팁 공유합니다',
    content: '제가 공모전 팀을 구성할 때 사용하는 방법들을 공유합니다. 1. 학교 커뮤니티 활용...',
    tags: ['공모전', '팁', '팀빌딩'],
    author: '공모전마스터',
    date: '2024.04.14',
    likes: 45,
    comments: 15,
  },
]

// Simulation example result
export const simulationExampleResult = {
  question: '복수전공을 할지 말지 고민 중이야',
  optionA: {
    title: '복수전공 하기',
    future: '다양한 분야의 지식을 갖춘 융합형 인재로 성장',
    pros: ['다학제적 시각 확보', '넓은 취업 선택지', '차별화된 경쟁력'],
    cons: ['학점 관리 부담', '전공 심화 어려움', '시간 투자 증가'],
    preparation: ['복수전공 신청 일정 확인', '선수과목 이수', '시간표 조율'],
    recommendation: '관심 분야가 명확하고 시간 관리에 자신 있다면 추천',
  },
  optionB: {
    title: '전공 심화',
    future: '한 분야의 전문가로 깊이 있는 역량 구축',
    pros: ['전문성 강화', '학점 관리 용이', '프로젝트/연구 집중 가능'],
    cons: ['제한된 시각', '관련 분야 외 취업 어려움', '융합 역량 부족'],
    preparation: ['심화 과목 수강', '관련 자격증 취득', '프로젝트 경험'],
    recommendation: '목표 직무가 명확하고 깊이 있는 전문성을 원한다면 추천',
  },
  summary: '복수전공은 시간 투자 대비 폭넓은 가능성을, 전공 심화는 깊이 있는 전문성을 제공합니다. 본인의 목표와 상황에 따라 선택하되, 어떤 선택이든 주도적으로 역량을 쌓아가는 것이 중요합니다.',
}

// Character growth stages
export const growthStages = [
  { level: 1, name: '진로 탐색 시작', description: '꿈을 향한 첫 걸음을 내딛었어요!' },
  { level: 5, name: '정보 수집가', description: '다양한 정보를 모으고 있어요!' },
  { level: 10, name: '방향 설정자', description: '나만의 방향을 찾아가고 있어요!' },
  { level: 15, name: '실천하는 도전자', description: '목표를 향해 달려가고 있어요!' },
  { level: 20, name: '꿈을 이루는 자', description: '꿈에 한 발 더 가까워졌어요!' },
]
