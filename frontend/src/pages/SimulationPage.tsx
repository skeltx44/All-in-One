import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Users,
  RotateCcw,
} from 'lucide-react'
import { useExpToast } from '@/components/common/useExpToast'

type SimulationState = 'input' | 'loading' | 'result' | 'roadmap'

type SimulationOption = {
  title: string
  pros: string[]
  cons: string[]
  recommendation: string
  ratio?: number
}

type SimulationResult = {
  question: string
  optionA: SimulationOption
  optionB: SimulationOption
  summary: string
  roadmapA: RoadmapStep[]
  roadmapB: RoadmapStep[]
}

type RoadmapStep = {
  step: string
  title: string
  desc: string
}

export function SimulationPage() {
  const [state, setState] = useState<SimulationState>('input')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<SimulationResult | null>(null)

  const { showExpToast, ExpToast } = useExpToast()

  const addCharacterExp = async (
    amount: number,
    activityType: string,
    description: string
  ) => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    await fetch(`http://localhost:4000/api/db/characters/${user.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activity_type: activityType,
        description,
        exp_amount: amount,
      }),
    })
  }

  const handleSimulate = async () => {
    if (!input.trim()) return

    setState('loading')

    try {
      const res = await fetch('http://localhost:4000/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: input,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '시뮬레이션 요청 실패')
      }

      if (!data.optionA || !data.optionB) {
        throw new Error('시뮬레이션 응답 형식이 올바르지 않습니다.')
      }

      const normalizedResult: SimulationResult = {
        question: data.question || input,
        optionA: {
          title: data.optionA.title || '선택 A',
          pros: Array.isArray(data.optionA.pros) ? data.optionA.pros : [],
          cons: Array.isArray(data.optionA.cons) ? data.optionA.cons : [],
          recommendation: data.optionA.recommendation || '',
          ratio: data.optionA.ratio ?? 65,
        },
        optionB: {
          title: data.optionB.title || '선택 B',
          pros: Array.isArray(data.optionB.pros) ? data.optionB.pros : [],
          cons: Array.isArray(data.optionB.cons) ? data.optionB.cons : [],
          recommendation: data.optionB.recommendation || '',
          ratio: data.optionB.ratio ?? 35,
        },
        summary:
          data.summary ||
          '두 선택 모두 가능성이 있으므로, 현재 목표와 상황에 맞춰 선택하는 것이 중요합니다.',
          roadmapA: Array.isArray(data.roadmapA) ? data.roadmapA : [],
          roadmapB: Array.isArray(data.roadmapB) ? data.roadmapB : [],
        }

      await addCharacterExp(15, 'simulation', 'AI 시뮬레이션 완료')
      showExpToast(15)

      setResult(normalizedResult)
      setState('result')
    } catch (error) {
      console.error('시뮬레이션 실패:', error)
      setState('input')
    }
  }

  const handleReset = () => {
    setState('input')
    setInput('')
    setResult(null)
  }

  return (
    <div className="px-4 pt-5 pb-28">
      {state !== 'loading' && (
        <header className="mb-2 pl-2">
          {state === 'input' ? (
            <>
              <h1 className="mb-1 text-xl font-bold text-foreground">
                시뮬레이션
              </h1>
              <p className="text-[13px] text-muted-foreground">
                고민되는 선택을 AI가 비교해드려요
              </p>
            </>
          ) : (
            <h1 className="mb-1 text-xl font-bold text-foreground">
              {state === 'roadmap' ? '미래 로드맵' : '분석 결과'}
            </h1>
          )}
        </header>
      )}

      {state === 'input' && (
        <div className="space-y-2">
          <Card className="mt-8 rounded-[30px] py-1">
            <CardContent className="px-2 py-2.5">
              <div className="mb-4">
                <h2 className="text-center text-[16px] font-semibold tracking-[-0.03em] text-foreground">
                  AI와 함께 미래를 그려보세요
                </h2>
              </div>

              <textarea
                placeholder="고민을 입력해 주세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="h-[160px] w-full resize-none rounded-[22px] border border-input bg-white px-4 py-3 text-[14px] leading-relaxed text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
              />

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge
                  variant="secondary"
                  className="h-7 cursor-pointer rounded-full px-2.5 text-[12px] font-medium"
                  onClick={() =>
                    setInput('복수전공을 할지 전공심화를 할지 고민 중이야')
                  }
                >
                  복수전공 vs 전공심화
                </Badge>

                <Badge
                  variant="secondary"
                  className="h-7 cursor-pointer rounded-full px-2.5 text-[12px] font-medium"
                  onClick={() =>
                    setInput('취업을 먼저 할지 대학원을 갈지 고민 중이야')
                  }
                >
                  취업 vs 대학원
                </Badge>

                <Badge
                  variant="secondary"
                  className="h-7 cursor-pointer rounded-full px-2.5 text-[12px] font-medium"
                  onClick={() =>
                    setInput('공모전을 준비할지 인턴을 준비할지 고민 중이야')
                  }
                >
                  공모전 vs 인턴
                </Badge>
              </div>
            </CardContent>
          </Card>

          <button
            type="button"
            onClick={handleSimulate}
            disabled={!input.trim()}
            className={
              input.trim()
                ? 'flex h-12 w-full items-center justify-center gap-2 rounded-[24px] bg-primary text-[15px] font-semibold text-primary-foreground active:scale-[0.98]'
                : 'flex h-12 w-full items-center justify-center gap-2 rounded-[24px] bg-slate-200 text-[15px] font-semibold text-slate-500'
            }
          >
            <Sparkles className="h-4.5 w-4.5" />
            시뮬레이션 하기
          </button>
        </div>
      )}

      {state === 'loading' && (
        <div className="flex min-h-[78vh] flex-col items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <Loader2
              className="absolute h-20 w-20 animate-spin text-primary"
              strokeWidth={1.7}
            />

            <Sparkles className="h-6 w-6 text-primary" strokeWidth={1.8} />
          </div>

          <p className="mt-5 text-[16px] font-semibold tracking-[-0.03em] text-foreground">
            AI가 분석 중이에요
          </p>

          <p className="mt-1 text-[13px] text-muted-foreground">
            선택지의 가능성을 비교하고 있어요
          </p>
        </div>
      )}

      {state === 'result' && result && (
        <div className="space-y-3">
          <Card className="rounded-[30px] py-0">
            <CardContent className="space-y-1.5 px-2.5 py-2.5">
              <p className="mb-1 text-[12px] font-semibold text-primary">
                분석 질문
              </p>
              <p className="text-[14.5px] font-semibold leading-relaxed tracking-[-0.03em] text-foreground">
                {result.question}
              </p>
            </CardContent>
          </Card>

          <OptionCard option={result.optionA} label="선택 A" color="blue" />

          <OptionCard option={result.optionB} label="선택 B" color="green" />

          <Card className="mt-4 rounded-[30px] py-0">
            <CardContent className="space-y-1 px-1 py-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                  <Lightbulb
                    className="h-4 w-4 text-yellow-700"
                    strokeWidth={1.9}
                  />
                </div>
                <h3 className="text-[15px] font-semibold text-foreground">
                  종합 조언
                </h3>
              </div>

              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {result.summary}
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-[30px] py-0">
            <CardContent className="p-4">
              <div className="mb-2 flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <h3 className="text-[14px] font-semibold text-foreground">
                  비슷한 고민의 선택 분포
                </h3>
              </div>

              <div className="h-7 overflow-hidden rounded-full bg-sky-100">
                <div
                  className="flex h-full items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-white transition-all duration-500"
                  style={{ width: `${result.optionA.ratio ?? 65}%` }}
                >
                  {result.optionA.ratio ?? 65}%
                </div>
              </div>

              <div className="mt-2 flex justify-between text-[11px] text-muted-foreground">
                <span>{result.optionA.title}</span>
                <span>{result.optionB.title}</span>
              </div>
            </CardContent>
          </Card>

          <button
            type="button"
            onClick={() => setState('roadmap')}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[22px] bg-primary text-[14px] font-semibold text-primary-foreground active:scale-[0.98]"
          >
            로드맵 확인하기
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-[22px] bg-sky-100 text-[14px] font-semibold text-primary active:scale-[0.98]"
          >
            <RotateCcw className="h-4 w-4" />
            새로운 시뮬레이션
          </button>
        </div>
      )}

      {state === 'roadmap' && result && (
        <div className="space-y-3">
          <Card className="rounded-[30px] py-0">
            <CardContent className="px-3 py-2.5">
              <p className="mb-1 text-[12px] font-semibold text-primary">
                미래 로드맵
              </p>
              <h2 className="text-[16.5px] font-semibold tracking-[-0.04em] text-foreground">
                선택 이후의 흐름을 그려봤어요
              </h2>
              <p className="mt-0 text-[13px] leading-relaxed text-muted-foreground">
                나아갈 수 있는 방향을 보여드려요
              </p>
            </CardContent>
          </Card>

          <FutureRoadmap result={result} />

          <button
            type="button"
            onClick={() => setState('result')}
            className="flex h-11 w-full items-center justify-center rounded-[22px] bg-sky-100 text-[14px] font-semibold text-primary active:scale-[0.98]"
          >
            분석 결과로 돌아가기
          </button>
        </div>
      )}

      {ExpToast}
    </div>
  )
}

type OptionCardProps = {
  option: SimulationOption
  label: string
  color: 'blue' | 'green'
}

function OptionCard({ option, label, color }: OptionCardProps) {
  const colorClass =
    color === 'blue'
      ? 'bg-blue-100 text-primary'
      : 'bg-emerald-100 text-emerald-700'

  return (
    <Card className="rounded-[30px] py-0">
      <CardContent className="space-y-1.5 px-1 py-3">
        <div className="flex items-center gap-2">
          <Badge
            className={`h-5 rounded-full px-2 text-[10px] font-medium ${colorClass}`}
          >
            {label}
          </Badge>

          <h3 className="text-[16px] font-semibold tracking-[-0.03em] text-foreground">
            {option.title}
          </h3>
        </div>

        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            <p className="text-[13px] font-semibold text-foreground">
              장점
            </p>
          </div>

          <ul className="space-y-1 text-[12px] leading-relaxed text-muted-foreground">
            {option.pros.map((pro, i) => (
              <li key={i}>• {pro}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-1 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-[13px] font-semibold text-foreground">
              주의할 점
            </p>
          </div>

          <ul className="space-y-1 text-[12px] leading-relaxed text-muted-foreground">
            {option.cons.map((con, i) => (
              <li key={i}>• {con}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-[18px] bg-sky-50 px-3 py-2">
          <p className="text-[12px] font-medium leading-relaxed text-primary">
            {option.recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function FutureRoadmap({ result }: { result: SimulationResult }) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <RoadmapColumn
        label="선택 A"
        title={result.optionA.title}
        steps={result.roadmapA}
        color="blue"
      />

      <RoadmapColumn
        label="선택 B"
        title={result.optionB.title}
        steps={result.roadmapB}
        color="green"
      />
    </div>
  )
}

function RoadmapColumn({
  label,
  title,
  steps,
  color,
}: {
  label: string
  title: string
  steps: RoadmapStep[]
  color: 'blue' | 'green'
}) {
  const badgeClass =
    color === 'blue'
      ? 'bg-blue-100 text-primary'
      : 'bg-emerald-100 text-emerald-700'

  const nodeClass =
    color === 'blue'
      ? 'bg-primary text-white'
      : 'bg-emerald-500 text-white'

  const arrowClass =
    color === 'blue' ? 'text-primary/50' : 'text-emerald-500/50'

  return (
    <div className="rounded-[22px] bg-white px-2 py-2.5 shadow-[0_6px_16px_rgba(73,105,140,0.12)]">
      <div className="mb-2">
        <Badge
          className={`h-5 rounded-full px-2 text-[10px] font-medium ${badgeClass}`}
        >
          {label}
        </Badge>

        <h3 className="mt-1.5 line-clamp-1 text-[14px] font-semibold tracking-[-0.03em] text-foreground">
          {title}
        </h3>
      </div>

      <div className="space-y-1">
        {steps.map((item, index) => (
          <div key={item.step}>
            <div className="rounded-[16px] bg-slate-50 px-1.5 py-2">
              <div className="mb-1 flex items-center gap-1">
                <div
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${nodeClass}`}
                >
                  {index + 1}
                </div>

                <p className="text-[10px] font-semibold text-muted-foreground">
                  {item.step}
                </p>
              </div>

              <p className="line-clamp-1 text-[12px] font-semibold tracking-[-0.03em] text-foreground">
                {item.title}
              </p>

              <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-muted-foreground">
                {item.desc}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex justify-center py-0 text-[14px] ${arrowClass}`}
              >
                ↓
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}