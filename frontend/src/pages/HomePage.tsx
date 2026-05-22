import { useEffect, useState } from 'react'
import { Character } from '@/components/common/Character'
import { ExpBar } from '@/components/common/ExpBar'
import { MenuCard } from '@/components/common/MenuCard'
import { Sparkles, BookOpen, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

type HomeCharacter = {
  level: number
  exp: number
  maxExp: number
}

type HomeCareer = {
  selected_career: string | null
}

const getMaxExp = (level: number) => {
  if (level === 1) return 10
  if (level === 2) return 50
  return 50
}

export function HomePage() {
  const [character, setCharacter] = useState<HomeCharacter>({
    level: 1,
    exp: 0,
    maxExp: 10,
  })

  const [career, setCareer] = useState<HomeCareer>({
    selected_career: null,
  })

  useEffect(() => {
    fetchHomeData()
  }, [])

  const fetchHomeData = async () => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) return

    const user = JSON.parse(savedUser)

    const characterRes = await fetch(
      `http://localhost:4000/api/db/characters/${user.id}`
    )

    const careerRes = await fetch(
      `http://localhost:4000/api/db/user-careers/${user.id}`
    )

    const characterData = await characterRes.json()
    const careerData = await careerRes.json()

    setCharacter({
      level: characterData.level,
      exp: characterData.exp,
      maxExp: getMaxExp(characterData.level),
    })

    setCareer({
      selected_career: careerData?.selected_career || null,
    })
  }

  return (
    <div className="min-h-screen px-4 pt-12 safe-area-top">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">All in One</h1>
        <p className="text-muted-foreground text-sm text-balance">
          당신의 꿈을 향한 여정을 함께합니다
        </p>
      </header>

      <section className="flex flex-col items-center mb-8">
        <Link to="/character">
          <Character size="lg" level={character.level} />
        </Link>

        <div className="mt-6 w-full max-w-xs">
          <ExpBar
            exp={character.exp}
            maxExp={character.maxExp}
            level={character.level}
          />
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {career.selected_career
            ? `${career.selected_career} 준비중 ✨`
            : '진로를 선택해보세요 ✨'}
        </p>
      </section>

      <section className="space-y-3">
        <MenuCard
          title="미래 선택 시뮬레이션"
          description="AI가 분석해주는 진로 선택"
          icon={<Sparkles className="h-6 w-6 text-primary" />}
          to="/simulation"
        />
        <MenuCard
          title="자격증 · 인턴 · 공모전 정보"
          description="놓치면 안되는 기회들"
          icon={<BookOpen className="h-6 w-6 text-primary" />}
          to="/info"
        />
        <MenuCard
          title="진로 커뮤니티"
          description="함께 성장하는 공간"
          icon={<Users className="h-6 w-6 text-primary" />}
          to="/community"
        />
      </section>
    </div>
  )
}