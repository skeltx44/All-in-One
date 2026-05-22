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
  maxExp: number
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

const getMaxExp = (level: number) => {
  if (level === 1) return 10
  if (level === 2) return 50
  return 50
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

    const res = await fetch(`http://localhost:4000/api/db/characters/${user.id}`)

    if (!res.ok) {
      console.error('캐릭터 조회 실패')
      setCharacterData(null)
      return
    }

    const dbCharacter = await res.json()

    setCharacterData({
      level: dbCharacter.level,
      exp: dbCharacter.exp,
      maxExp: getMaxExp(dbCharacter.level),
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
      <div className="min-h-screen px-4 pt-12 pb-8 safe-area-top">
        <p className="text-sm text-muted-foreground">
          캐릭터 정보를 불러오는 중...
        </p>
      </div>
    )
  }

  const currentStage = characterData.growthStages
    .filter((stage) => stage.level <= characterData.level)
    .pop()

  const nextStage = characterData.growthStages.find(
    (stage) => stage.level > characterData.level
  )

  return (
    <div className="min-h-screen px-4 pt-12 pb-8 safe-area-top">
      <header className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>돌아가기</span>
        </Link>

        <h1 className="text-xl font-bold text-foreground">나의 캐릭터</h1>
      </header>

      <section className="flex flex-col items-center mb-8">
        <Character size="lg" level={characterData.level} />

        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {currentStage?.name}
          </h2>

          <p className="text-sm text-muted-foreground mb-4">
            {currentStage?.description}
          </p>
        </div>

        <div className="w-full max-w-xs">
          <ExpBar
            exp={characterData.exp}
            maxExp={characterData.maxExp}
            level={characterData.level}
          />
        </div>
      </section>

      {nextStage && (
        <Card className="mb-6 bg-primary/5 border-primary/20">
          <CardContent className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10">
              <Star className="h-6 w-6 text-primary" />
            </div>

            <div>
              <p className="text-xs text-muted-foreground">다음 단계</p>
              <p className="font-semibold text-foreground">
                Lv.{nextStage.level} {nextStage.name}
              </p>
              <p className="text-xs text-primary">
                {characterData.maxExp - characterData.exp} EXP 더 필요해요
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">획득 배지</CardTitle>
          </div>

          {characterData.badges.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 획득한 배지가 없어요.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {characterData.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50"
                >
                  <span className="text-2xl">{badge.icon}</span>

                  <div>
                    <p className="font-medium text-foreground text-sm">
                      {badge.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {badge.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">성장 단계</CardTitle>
          </div>

          <div className="space-y-3">
            {growthStages.map((stage) => (
              <div
                key={stage.level}
                className="flex items-center justify-between rounded-xl bg-secondary/50 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Lv.{stage.level} {stage.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stage.description}
                  </p>
                </div>

                {characterData.level >= stage.level && (
                  <Badge>달성</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}