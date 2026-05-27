import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Character } from '@/components/common/Character'
import { ExpBar } from '@/components/common/ExpBar'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trophy, Star } from 'lucide-react'

type GrowthStage = {
  level: number
  name: string
  description: string
}

type BadgeItem = {
  id: number
  icon: string
  name: string
  date: string
}

type CharacterData = {
  level: number
  exp: number
  growthStages: GrowthStage[]
  badges: BadgeItem[]
}

const growthStages: GrowthStage[] = [
  {
    level: 1,
    name: '씨앗 단계',
    description: '진로 여정을 막 시작했어요.',
  },
  {
    level: 2,
    name: '새싹 단계',
    description: '조금씩 방향을 잡아가고 있어요.',
  },
  {
    level: 3,
    name: '꽃 단계',
    description: '목표를 향해 꾸준히 성장하고 있어요.',
  },
]

const getNextLevelInfo = (level: number, exp: number) => {
  if (level >= 3) return null

  const targetExp = level === 1 ? 20 : 50
  const nextLevel = level + 1
  const remainExp = Math.max(targetExp - exp, 0)

  return {
    nextLevel,
    targetExp,
    remainExp,
  }
}

export function CharacterPage() {
  const [characterData, setCharacterData] = useState<CharacterData | null>(null)

  useEffect(() => {
    fetchCharacterData()
  }, [])

  const fetchCharacterData = async () => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) {
      setCharacterData(null)
      return
    }

    const user = JSON.parse(savedUser)

    const res = await fetch(`${API_BASE_URL}/api/db/characters/${user.id}`)

    if (!res.ok) {
      console.error('캐릭터 조회 실패')
      setCharacterData(null)
      return
    }

    const dbCharacter = await res.json()

    setCharacterData({
      level: dbCharacter.level,
      exp: dbCharacter.exp,
      growthStages,
      badges: dbCharacter.badge
        ? [
            {
              id: 1,
              icon: '🏅',
              name: dbCharacter.badge,
              date: '획득 완료',
            },
          ]
        : [],
    })
  }

  if (!characterData) {
    return (
      <div className="px-4 pt-5">
        <p className="text-[13px] text-muted-foreground">
          캐릭터 정보를 불러오는 중...
        </p>
      </div>
    )
  }

  const currentStage = characterData.growthStages
    .filter((stage) => stage.level <= characterData.level)
    .pop()

  const nextLevelInfo = getNextLevelInfo(
    characterData.level,
    characterData.exp,
  )

  return (
    <div className="px-4 pt-5 pb-32">
      <header className="relative mb-3 h-[76px]">
        <Link
          to="/"
          className="absolute left-0 top-0 inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>돌아가기</span>
        </Link>

        <h1 className="absolute left-0 right-0 top-7 text-center text-xl font-bold tracking-[-0.03em] text-foreground">
          캐릭터의 성장을 확인해보세요
        </h1>
      </header>

      <section className="mb-4 flex flex-col items-center">
        <Character size="home" level={characterData.level} />

        <div className="mt-3 text-center">
          <h2 className="text-[18px] font-semibold tracking-[-0.03em] text-foreground">
            {currentStage?.name}
          </h2>

          <p className="mt-1 text-[13px] text-muted-foreground">
            {currentStage?.description}
          </p>
        </div>

        <div className="mt-4 w-full">
          <ExpBar
            exp={characterData.exp}
            level={characterData.level}
            size="sm"
          />
        </div>
      </section>

      {nextLevelInfo && (
        <Card className="mb-3 rounded-[30px] py-0">
          <CardContent className="flex items-center gap-3 p-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 shadow-inner">
              <Star className="h-5 w-5 text-primary" strokeWidth={1.9} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-muted-foreground">
                다음 단계
              </p>
              <p className="mt-0.5 text-[14px] font-semibold text-foreground">
                Lv.{nextLevelInfo.nextLevel}까지 {nextLevelInfo.remainExp} EXP 남았어요
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-3 rounded-[30px] py-0">
        <CardContent className="px-1 py-2.5">
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4 text-primary" strokeWidth={1.9} />
            <CardTitle className="text-[14px] font-semibold">
              획득 배지
            </CardTitle>
          </div>

          {characterData.badges.length === 0 ? (
            <p className="text-[13px] text-muted-foreground">
              아직 획득한 배지가 없어요.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {characterData.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-2 rounded-[18px] bg-secondary/50 px-2 py-2.5"
                >
                  <span className="text-xl">{badge.icon}</span>

                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">
                      {badge.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {badge.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-[30px] py-0">
        <CardContent className="px-1 py-2.5">
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" strokeWidth={1.9} />
            <CardTitle className="text-[14px] font-semibold">
              성장 단계
            </CardTitle>
          </div>

          <div className="space-y-2">
            {growthStages.map((stage) => (
              <div
                key={stage.level}
                className="flex items-center justify-between gap-3 rounded-[18px] bg-secondary/50 px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-foreground">
                    Lv.{stage.level} {stage.name}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {stage.description}
                  </p>
                </div>

                {characterData.level >= stage.level && (
                  <Badge className="h-5 shrink-0 px-1.5 text-[10px] font-medium">
                    달성
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}