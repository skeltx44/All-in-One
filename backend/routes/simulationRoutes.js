const express = require("express")
const router = express.Router()
const { GoogleGenAI } = require("@google/genai")

const ai = new GoogleGenAI({
  apiKey: process.env.API_KEY,
})

const fallbackResult = (question) => ({
  question,

  optionA: {
    title: "복수전공 하기",
    pros: [
      "진로 선택지를 넓힐 수 있습니다.",
      "융합형 포트폴리오를 만들기 좋습니다.",
      "다양한 분야 경험을 쌓을 수 있습니다.",
    ],
    cons: [
      "학업 부담이 늘어날 수 있습니다.",
      "시간 관리가 어려울 수 있습니다.",
      "깊이 있는 학습이 늦어질 수 있습니다.",
    ],
    recommendation:
      "새로운 분야를 탐색하고 싶다면 복수전공이 적합합니다.",
    ratio: 58,
  },

  optionB: {
    title: "전공 심화",
    pros: [
      "한 분야의 전문성을 키울 수 있습니다.",
      "학습 방향이 명확해집니다.",
      "전공 기반 활동과 연결하기 쉽습니다.",
    ],
    cons: [
      "진로 선택지가 좁아질 수 있습니다.",
      "다른 분야 탐색이 줄어들 수 있습니다.",
      "변화에 대응하기 어려울 수 있습니다.",
    ],
    recommendation:
      "전공에 확신이 있다면 전공 심화가 안정적입니다.",
    ratio: 42,
  },

  summary:
    "진로를 넓게 탐색하고 싶다면 복수전공이, 깊이를 쌓고 싶다면 전공 심화가 더 적합합니다.",

  roadmapA: [
    {
      step: "STEP 1",
      title: "방향 설정",
      desc: "연결할 관심 분야를 정리합니다.",
    },
    {
      step: "STEP 2",
      title: "기초 보완",
      desc: "부족한 핵심 개념을 학습합니다.",
    },
    {
      step: "STEP 3",
      title: "프로젝트",
      desc: "융합형 결과물을 만들어봅니다.",
    },
    {
      step: "STEP 4",
      title: "진로 확장",
      desc: "경험을 포트폴리오로 연결합니다.",
    },
  ],

  roadmapB: [
    {
      step: "STEP 1",
      title: "분야 집중",
      desc: "전공의 핵심 역량을 정리합니다.",
    },
    {
      step: "STEP 2",
      title: "심화 학습",
      desc: "깊이 있는 주제를 탐색합니다.",
    },
    {
      step: "STEP 3",
      title: "실력 증명",
      desc: "활동으로 전문성을 보여줍니다.",
    },
    {
      step: "STEP 4",
      title: "진로 연결",
      desc: "특정 직무로 방향을 잡습니다.",
    },
  ],
})

const buildPrompt = (question) => `
너는 진로 선택을 도와주는 AI 시뮬레이션 도우미다.

사용자의 고민:
"${question}"

사용자의 고민을 반드시 A/B 선택 구조로 분석해라.
예를 들어 "복수전공을 할지 전공심화를 할지"라면 optionA와 optionB를 각각 하나의 선택지로 둔다.

반드시 아래 JSON 형식으로만 응답해라.
JSON 밖에 설명 문장, 코드블록, 마크다운을 절대 쓰지 마라.

제한:
- optionA.title, optionB.title은 각각 12자 이내
- pros는 정확히 3개
- cons는 정확히 3개
- pros/cons 각 문장은 24자 이내
- recommendation은 45자 이내
- summary는 90자 이내
- ratio는 optionA와 optionB 합쳐서 100
- roadmapA와 roadmapB는 각각 정확히 4단계
- roadmap title은 8자 이내
- roadmap desc는 22자 이내
- 모든 내용은 한국어로 작성

형식:
{
  "question": "사용자 질문",
  "optionA": {
    "title": "선택 A 제목",
    "pros": ["장점1", "장점2", "장점3"],
    "cons": ["단점1", "단점2", "단점3"],
    "recommendation": "짧은 추천 문장",
    "ratio": 60
  },
  "optionB": {
    "title": "선택 B 제목",
    "pros": ["장점1", "장점2", "장점3"],
    "cons": ["단점1", "단점2", "단점3"],
    "recommendation": "짧은 추천 문장",
    "ratio": 40
  },
  "summary": "전체 요약",
  "roadmapA": [
    { "step": "STEP 1", "title": "단계명", "desc": "짧은 설명" },
    { "step": "STEP 2", "title": "단계명", "desc": "짧은 설명" },
    { "step": "STEP 3", "title": "단계명", "desc": "짧은 설명" },
    { "step": "STEP 4", "title": "단계명", "desc": "짧은 설명" }
  ],
  "roadmapB": [
    { "step": "STEP 1", "title": "단계명", "desc": "짧은 설명" },
    { "step": "STEP 2", "title": "단계명", "desc": "짧은 설명" },
    { "step": "STEP 3", "title": "단계명", "desc": "짧은 설명" },
    { "step": "STEP 4", "title": "단계명", "desc": "짧은 설명" }
  ]
}
`

const normalizeResult = (data, question) => {
  const optionARatio = Number(data?.optionA?.ratio)
  const optionBRatio = Number(data?.optionB?.ratio)

  const ratioA =
    Number.isFinite(optionARatio) && optionARatio > 0
      ? optionARatio
      : 60

  const ratioB =
    Number.isFinite(optionBRatio) && optionBRatio > 0
      ? optionBRatio
      : 100 - ratioA

  return {
    question: data?.question || question,

    optionA: {
      title: data?.optionA?.title || "선택 A",
      pros: Array.isArray(data?.optionA?.pros)
        ? data.optionA.pros.slice(0, 3)
        : [],
      cons: Array.isArray(data?.optionA?.cons)
        ? data.optionA.cons.slice(0, 3)
        : [],
      recommendation: data?.optionA?.recommendation || "",
      ratio: ratioA,
    },

    optionB: {
      title: data?.optionB?.title || "선택 B",
      pros: Array.isArray(data?.optionB?.pros)
        ? data.optionB.pros.slice(0, 3)
        : [],
      cons: Array.isArray(data?.optionB?.cons)
        ? data.optionB.cons.slice(0, 3)
        : [],
      recommendation: data?.optionB?.recommendation || "",
      ratio: ratioB,
    },

    summary:
      data?.summary ||
      "두 선택 모두 가능성이 있으므로 현재 목표와 상황에 맞춰 선택하는 것이 중요합니다.",

    roadmapA: Array.isArray(data?.roadmapA)
      ? data.roadmapA.slice(0, 4)
      : [],
    roadmapB: Array.isArray(data?.roadmapB)
      ? data.roadmapB.slice(0, 4)
      : [],
  }
}

router.post("/", async (req, res) => {
  const { question } = req.body

  if (!question || !question.trim()) {
    return res.status(400).json({
      error: "질문을 입력해주세요",
    })
  }

  try {
    if (!process.env.API_KEY) {
      throw new Error("API_KEY가 설정되지 않았습니다.")
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildPrompt(question),
    })

    const text = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(text)
    const result = normalizeResult(parsed, question)

    res.json(result)
  } catch (err) {
    console.error("Gemini 시뮬레이션 실패:", err)

    res.json(fallbackResult(question))
  }
})

module.exports = router