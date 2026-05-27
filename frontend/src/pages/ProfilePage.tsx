import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { User, Target, Heart, Award, Bookmark, RefreshCcw } from 'lucide-react'

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
      `${API_BASE_URL}/api/db/characters/${user.id}`
    )

    const careerRes = await fetch(
      `${API_BASE_URL}/api/db/user-careers/${user.id}`
    )

    const character = await characterRes.json()
    const career = await careerRes.json()

    const scrapsRes = await fetch(
      `${API_BASE_URL}/api/db/scraps/${user.id}`
    )

    const scraps = await scrapsRes.json()

    setUserData({
      nickname: user.nickname,
      level: character?.level ?? 1,
      career: career?.selected_career || '아직 선택하지 않음',
      interests: career?.interest_field
        ? career.interest_field.split(',').filter(Boolean)
        : [],
      goal: career?.goal || '아직 설정하지 않음',
      savedItems: scraps,
    })
  }

  if (!userData) {
    return (
      <div className="px-6 pt-5">
        <header className="mb-4">
          <h1 className="mb-1 text-xl font-bold text-foreground">프로필</h1>
          <p className="text-[13px] text-muted-foreground">
            로그인 후 이용할 수 있어요
          </p>
        </header>

        <Link to="/login">
          <Button className="h-10 w-full rounded-[22px]">
            로그인하러 가기
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="px-4 pt-5 pb-25">
      <header className="mb-4 pl-2">
        <h1 className="mb-1 text-xl font-bold text-foreground">프로필</h1>
        <p className="text-[13px] text-muted-foreground">
          나의 진로 정보 관리
        </p>
      </header>

      <Card className="mb-2.5 rounded-[30px] py-0">
        <CardContent className="p-3">
          <div className="flex items-center gap-3 -ml-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-blue-100 to-sky-50 shadow-inner">
              <User className="h-7 w-7 text-primary" strokeWidth={1.9} />
            </div>

            <div>
              <h2 className="text-[16px] font-semibold text-foreground">
                {userData.nickname}
              </h2>
              <p className="mt-0.5 text-[13px] text-muted-foreground">
                Lv.{userData.level}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-2 rounded-[30px] py-0">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start gap-3 -ml-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <Target className="h-4.5 w-4.5 text-primary" strokeWidth={1.9} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[11px] text-muted-foreground">
                선택한 진로
              </p>
              <p className="text-[14px] font-medium text-foreground">
                {userData.career}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 -ml-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <Heart className="h-4.5 w-4.5 text-emerald-700" strokeWidth={1.9} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[11px] text-muted-foreground">
                관심 분야
              </p>

              <div className="flex flex-wrap gap-1">
                {userData.interests.length > 0 ? (
                  userData.interests.map((interest, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="h-5 px-1.5 text-[10px] font-medium"
                    >
                      {interest}
                    </Badge>
                  ))
                ) : (
                  <p className="text-[14px] font-medium text-foreground">
                    아직 설정하지 않음
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 -ml-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <Award className="h-4.5 w-4.5 text-amber-700" strokeWidth={1.9} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="mb-0.5 text-[11px] text-muted-foreground">
                목표
              </p>
              <p className="text-[14px] font-medium text-foreground">
                {userData.goal}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link to="/start?mode=edit">
        <Button
          variant="secondary"
          className="mb-2.5 h-10 w-full rounded-[22px] bg-[#d8f0fb] text-[13px] font-medium text-slate-700 hover:bg-[#cceaf7]"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          진로 다시 선택하기
        </Button>
      </Link>

      <Card className="rounded-[30px] py-0">
        <CardContent className="p-4">
          <div className="mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2 -ml-2">
              <Bookmark className="h-4 w-4 text-primary" strokeWidth={1.9} />
              <CardTitle className="text-[14px] font-semibold">
                저장한 정보
              </CardTitle>
            </div>

            <Link to="/info" className="text-[11px] font-medium text-primary">
              전체보기
            </Link>
          </div>

          <div className="-mx-2.5 space-y-2">
            {userData.savedItems.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="w-full rounded-[18px] bg-secondary/50 px-3 py-2.5"
              >
                <p className="line-clamp-1 text-[13px] font-medium text-foreground">
                  {item.title}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  {item.deadline?.slice(0, 10)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}