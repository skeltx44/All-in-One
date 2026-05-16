import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/input'
import { Card, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Loader2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Users, // ✨ 통계용 아이콘만 유지
} from 'lucide-react'
import { cn } from '@/lib/utils'

type SimulationState = 'input' | 'loading' | 'result'

type SimulationResult = {
  question: string

  optionA: {
    title: string
    future: string
    pros: string[]
    cons: string[]
    preparation: string[]
    recommendation: string
    ratio?: number // ✨ 통계 비율 슬롯
  }

  optionB: {
    title: string
    future: string
    pros: string[]
    cons: string[]
    preparation: string[]
    recommendation: string
    ratio?: number // ✨ 통계 비율 슬롯
  }

  summary: string
}

export function SimulationPage() {
  const [state, setState] = useState<SimulationState>('input')
  const [input, setInput] = useState('')
  const [result, setResult] = useState<SimulationResult | null>(null)

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

      const data: SimulationResult = await res.json()

      // 임시 데이터 제공 (백엔드 미구현 대비)
      if (!data.optionA.ratio) {
        data.optionA.ratio = 65;
        data.optionB.ratio = 35;
      }

      setResult(data)
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
    <div className="min-h-screen px-4 pt-12 pb-8 safe-area-top">
      <header className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold text-foreground">
            미래 선택 시뮬레이션
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          고민되는 선택을 AI가 비교 분석해드려요
        </p>
      </header>

      {state === 'input' && (
        <div className="space-y-4">
          <Card>
            <CardContent>
              <Textarea
                placeholder="예: 복수전공을 할지 말지 고민 중이야"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-[140px]"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setInput('복수전공을 할지 말지 고민 중이야')}
                >
                  복수전공 vs 전공심화
                </Badge>

                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setInput('취업을 먼저 할지 대학원을 갈지 고민 중이야')}
                >
                  취업 vs 대학원
                </Badge>

                <Badge
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => setInput('공모전을 준비할지 인턴을 준비할지 고민 중이야')}
                >
                  공모전 vs 인턴
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSimulate}
            disabled={!input.trim()}
            className="w-full"
            size="lg"
          >
            <Sparkles className="h-5 w-5" />
            시뮬레이션 하기
          </Button>
        </div>
      )}

      {state === 'loading' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
            <Sparkles className="h-6 w-6 text-primary absolute -top-2 -right-2 animate-pulse" />
          </div>
          <p className="mt-6 text-foreground font-medium">
            AI가 분석 중이에요...
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            잠시만 기다려주세요
          </p>
        </div>
      )}

      {state === 'result' && result && (
        <div className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">분석 질문</p>
                <p className="font-medium text-foreground">{result.question}</p>
              </div>
            </CardContent>
          </Card>

          {/* 📊 데이터 기반 통계 바 UI 대시보드 */}
          <Card className="bg-secondary/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">비슷한 고민을 한 선배들의 선택 분포</span>
              </div>
              <div className="relative w-full h-6 bg-peach rounded-full overflow-hidden flex text-xs font-bold text-white text-center items-center">
                <div 
                  className="bg-mint h-full flex items-center justify-center transition-all duration-500"
                  style={{ width: `${result.optionA.ratio}%` }}
                >
                  {result.optionA.title} ({result.optionA.ratio}%)
                </div>
                <div className="flex-1 flex items-center justify-center">
                  {result.optionB.title} ({result.optionB.ratio}%)
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <OptionCard
              option={result.optionA}
              label="선택 A"
              color="mint"
            />

            <div className="flex items-center justify-center">
              <div className="h-px flex-1 bg-border" />
              <span className="px-3 text-xs text-muted-foreground">VS</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <OptionCard
              option={result.optionB}
              label="선택 B"
              color="peach"
            />
          </div>

          <Card className="bg-lavender/30 border-lavender">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                <CardTitle className="text-base">종합 조언</CardTitle>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {result.summary}
              </p>
            </CardContent>
          </Card>

          <Button
            onClick={handleReset}
            variant="secondary"
            className="w-full"
            size="lg"
          >
            새로운 시뮬레이션
          </Button>
        </div>
      )}
    </div>
  )
}

interface OptionCardProps {
  option: {
    title: string
    future: string
    pros: string[]
    cons: string[]
    preparation: string[]
    recommendation: string
    ratio?: number
  }
  label: string
  color: 'mint' | 'peach'
}

function OptionCard({
  option,
  label,
  color,
}: OptionCardProps) {
  return (
    <Card
      className={cn(
        color === 'mint'
          ? 'border-l-4 border-l-mint'
          : 'border-l-4 border-l-peach'
      )}
    >
      <CardContent className="space-y-4">
        <div>
          <Badge variant={color} className="mb-2">
            {label}
          </Badge>
          <CardTitle>{option.title}</CardTitle>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">예상 미래</span>
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            {option.future}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-foreground">장점</span>
          </div>
          <ul className="text-sm text-muted-foreground ml-6 space-y-1">
            {option.pros.map((pro, i) => (
              <li key={i}>• {pro}</li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-medium text-foreground">단점</span>
          </div>
          <ul className="text-sm text-muted-foreground ml-6 space-y-1">
            {option.cons.map((con, i) => (
              <li key={i}>• {con}</li>
            ))}
          </ul>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-sm text-primary font-medium">
            {option.recommendation}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}