import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Target, Heart, Award, Bookmark, RefreshCcw, ChevronRight } from 'lucide-react'

type SavedItem = {
  id: number
  title: string
  category: string
  deadline: string
}

type UserData = {
  nickname: string
  level: number
  career: string
  interests: string[]
  goal: string
  savedItems: SavedItem[]
}

export function ProfilePage() {
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) {
      setUserData(null)
      return
    }

    const user = JSON.parse(savedUser)

    const characterRes = await fetch(
      `http://localhost:4000/api/db/characters/${user.id}`
    )

    const careerRes = await fetch(
      `http://localhost:4000/api/db/user-careers/${user.id}`
    )

    const character = await characterRes.json()
    const career = await careerRes.json()

    setUserData({
      nickname: user.nickname,
      level: character?.level ?? 1,
      career: career?.selected_career || '아직 선택하지 않음',
      interests: career?.interest_field
        ? career.interest_field.split(',').filter(Boolean)
        : [],
      goal: career?.goal || '아직 설정하지 않음',
      savedItems: [],
    })
  }

  if (!userData) {
  return (
    <div className="min-h-screen px-4 pt-12 pb-8 safe-area-top">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-2">프로필</h1>
        <p className="text-sm text-muted-foreground">로그인 후 이용할 수 있어요</p>
      </header>

      <Link to="/login">
        <Button className="w-full">
          로그인하러 가기
        </Button>
      </Link>
    </div>
    )
  }

  return (
    <div className="min-h-screen px-4 pt-12 pb-8 safe-area-top">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-2">프로필</h1>
        <p className="text-sm text-muted-foreground">나의 진로 정보 관리</p>
      </header>

      <Card className="mb-4">
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-b from-primary/20 to-mint/30 flex items-center justify-center">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">{userData.nickname}</h2>
              <p className="text-sm text-muted-foreground">Lv.{userData.level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-4">
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">선택한 진로</p>
              <p className="font-medium text-foreground">{userData.career}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-mint/30">
              <Heart className="h-5 w-5 text-accent-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">관심 분야</p>
              <div className="flex flex-wrap gap-1">
                {userData.interests.map((interest, i) => (
                  <Badge key={i} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-peach/50">
              <Award className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">목표</p>
              <p className="font-medium text-foreground">{userData.goal}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link to="/start?mode=edit">
        <Button variant="secondary" className="w-full mb-6">
          <RefreshCcw className="h-4 w-4" />
          진로 다시 선택하기
        </Button>
      </Link>

      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">저장한 정보</CardTitle>
            </div>
            <Link to="/info" className="text-xs text-primary">
              전체보기
            </Link>
          </div>

          <div className="space-y-3">
            {userData.savedItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/50"
              >
                <div>
                  <p className="font-medium text-foreground text-sm">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.category} · 마감 {item.deadline}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}