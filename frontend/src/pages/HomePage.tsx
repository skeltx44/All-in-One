import { useEffect, useState } from 'react'
import { Character } from '@/components/common/Character'
import { ExpBar } from '@/components/common/ExpBar'
import { Link } from 'react-router-dom'
import { CalendarCheck, Bookmark } from 'lucide-react'

type HomeCharacter = {
  level: number
  exp: number
}

type HomeCareer = {
  selected_career: string | null
}

export function HomePage() {
  const [character, setCharacter] = useState<HomeCharacter>({
    level: 1,
    exp: 0,
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
    })

    setCareer({
      selected_career: careerData?.selected_career || null,
    })
  }

  return (
    <div className="px-5 pt-6">
      <header className="mb-3 text-center">
        <h1 className="mb-1 text-xl font-bold text-foreground">
          All in One
        </h1>
        <p className="text-[13px] font-normal tracking-[-0.02em] text-slate-500">
          당신의 꿈을 향한 여정을 함께합니다
        </p>
      </header>

      <section className="mt-7 flex flex-col items-center">
        <Link to="/character" className="mb-4">
          <Character size="home" level={character.level} />
        </Link>

        <div className="w-full">
          <ExpBar exp={character.exp} level={character.level} size="sm" />
        </div>

        <p className="mt-0 text-[13px] font-medium text-slate-500">
          {career.selected_career
            ? `${career.selected_career} 준비중 ✨`
            : '진로를 선택해보세요 ✨'}
        </p>
      </section>

      <section className="mt-4">
        <div className="mb-2.5">
          <p className="text-[13px] font-semibold text-primary">
            오늘의 성장 미션
          </p>
          <h2 className="mt-0.5 text-[18px] font-semibold leading-tight tracking-[-0.03em] text-slate-950">
            캐릭터를 성장시켜보세요
          </h2>
        </div>

        <div className="grid w-full grid-cols-2 gap-3">
          <Link
            to="/attendance"
            className="flex h-[100px] flex-col justify-between rounded-[22px] bg-white p-3.5 text-left shadow-[0_6px_16px_rgba(73,105,140,0.12)] active:scale-[0.98]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-100 shadow-inner">
              <CalendarCheck className="h-5 w-5 text-lime-600" strokeWidth={1.8} />
            </div>

            <div>
              <h3 className="text-[15px] font-semibold tracking-[-0.03em] text-slate-950">
                출석하기
              </h3>
              <p className="mt-0.5 whitespace-nowrap text-[13px] font-medium tracking-[-0.04em] text-slate-500">
                성장 스탬프 받기
              </p>
            </div>
          </Link>

          <Link
            to="/info"
            className="flex h-[100px] flex-col justify-between rounded-[22px] bg-white p-3.5 text-left shadow-[0_6px_16px_rgba(73,105,140,0.12)] active:scale-[0.98]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 shadow-inner">
              <Bookmark
                className="h-5 w-5 text-sky-600"
                strokeWidth={1.8}
              />
            </div>

            <div>
              <h3 className="text-[15px] font-semibold tracking-[-0.03em] text-slate-950">
                스크랩하기
              </h3>
              <p className="mt-0.5 whitespace-nowrap text-[13px] font-medium tracking-[-0.04em] text-slate-500">
                관심 정보 저장하기
              </p>
            </div>
          </Link>
        </div>
      </section>
    </div>
  )
}