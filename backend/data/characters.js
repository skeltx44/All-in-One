const character = {
  level: 1,
  exp: 30,
  maxExp: 100,

  growthStages: [
    {
      level: 1,
      name: "진로 탐색 시작",
      description: "나의 관심 진로를 알아가는 단계입니다.",
    },
    {
      level: 2,
      name: "목표 설정",
      description: "구체적인 목표를 세우고 필요한 정보를 모으는 단계입니다.",
    },
    {
      level: 3,
      name: "실전 준비",
      description: "공모전, 인턴, 자격증 등 실제 준비를 시작하는 단계입니다.",
    },
  ],

  badges: [
    {
      id: 1,
      icon: "🌱",
      name: "첫 진로 탐색",
      date: "2026.05.16",
    },
    {
      id: 2,
      icon: "📌",
      name: "정보 저장",
      date: "2026.05.16",
    },
  ],

  recentActivities: [
    {
      id: 1,
      action: "AI 개발자 진로 선택",
      detail: "관심 진로를 선택했습니다.",
      exp: 10,
      date: "오늘",
    },
    {
      id: 2,
      action: "공모전 정보 확인",
      detail: "AI 아이디어 공모전 정보를 확인했습니다.",
      exp: 20,
      date: "오늘",
    },
  ],
}

module.exports = character