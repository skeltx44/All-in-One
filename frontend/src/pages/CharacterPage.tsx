import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Character } from '@/components/common/Character'
import { ExpBar } from '@/components/common/ExpBar'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trophy, Zap, Star } from 'lucide-react'

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

type RecentActivity = {
  id: number
  action: string
  detail: string
  exp: number
  date: string
}

type CharacterData = {
  level: number
  exp: number
  maxExp: number
  growthStages: GrowthStage[]
  badges: BadgeItem[]
  recentActivities: RecentActivity[]
}

export function CharacterPage() {
  const [characterData, setCharacterData] = useState<CharacterData | null>(null)

  useEffect(() => {
    fetchCharacterData()
  }, [])

  const fetchCharacterData = async () => {
    const res = await fetch('http://localhost:4000/api/characters')
    const data: CharacterData = await res.json()
    setCharacterData(data)
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
        <Character size="lg" />

        <div className="mt-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-1">
            {currentStage?.name}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            {currentStage?.description}
          </p>
        </div>

        <div className="w-full max-w-xs">
          <ExpBar />
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
                  <p className="text-xs text-muted-foreground">{badge.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">최근 활동</CardTitle>
          </div>

          <div className="space-y-3">
            {characterData.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.detail}
                  </p>
                </div>

                <div className="text-right">
                  <Badge variant="mint" className="mb-1">
                    +{activity.exp} EXP
                  </Badge>
                  <p className="text-xs text-muted-foreground">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}