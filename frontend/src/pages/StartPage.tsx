import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { careerOptions } from '@/data/dummy'
import { Check } from 'lucide-react'
import { addActivity } from '@/lib/addActivity'

const interestOptions: Record<string, string[]> = {
  ai: ['AI', '데이터분석', '웹개발', '앱개발'],
  designer: ['UI/UX', '그래픽', '브랜딩', '3D'],
  semiconductor: ['회로설계', '공정', '소자', '장비'],
  marketing: ['콘텐츠', '브랜딩', 'SNS', '시장분석'],
  finance: ['회계', '투자', '세무', '재무분석'],
}

export function StartPage() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
  const [customCareer, setCustomCareer] = useState('')
  const [customInterest, setCustomInterest] = useState('')
  const [goal, setGoal] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  const params = new URLSearchParams(location.search)
  const mode = params.get('mode')

  const selectedCareerData = careerOptions.find(
    (career) => career.id === selectedCareer
  )

  const currentInterests = selectedCareer
    ? interestOptions[selectedCareer] || []
    : []

  const isEtcCareer = selectedCareer === 'other'

  const handleSelectCareer = (careerId: string) => {
    setSelectedCareer(careerId)
    setSelectedInterests([])
    setCustomCareer('')
    setCustomInterest('')
  }

  const handleToggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((item) => item !== interest)
        : [...prev, interest]
    )
  }

  const handleComplete = async () => {
    if (!selectedCareerData) return

    const savedUser = localStorage.getItem('user')

    if (!savedUser) {
      alert('로그인 후 이용할 수 있습니다.')
      navigate('/login')
      return
    }

    if (isEtcCareer && !customCareer.trim()) {
      alert('진로를 직접 입력해주세요.')
      return
    }

    const user = JSON.parse(savedUser)

    const finalCareer = isEtcCareer
      ? customCareer.trim()
      : selectedCareerData.name

    const finalInterests = [
      ...selectedInterests,
      ...(customInterest.trim() ? [customInterest.trim()] : []),
    ]

    setIsSaving(true)

    try {
      const res = await fetch(
        `http://localhost:4000/api/db/user-careers/${user.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            selected_career: finalCareer,
            interest_field: finalInterests.join(','),
            goal,
          }),
        }
      )

      if (!res.ok) {
        throw new Error('진로 정보 저장 실패')
      }

      if (mode === 'signup') {
        await addActivity(user.id, 'career_select', '진로 정보 설정', 10)

        localStorage.removeItem('user')
        navigate('/login')
      } else {
        navigate('/profile')
      }
    } catch (err) {
      console.error(err)
      alert('진로 정보 저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="h-full overflow-y-auto px-5 pt-5 pb-8 scrollbar-hide">
      <header className="mb-5 pl-1">
        <h1 className="mb-1 text-xl font-bold text-foreground">
          관심 진로를 선택하세요
        </h1>
        <p className="text-[13px] text-muted-foreground">
          선택한 진로에 맞춤 정보를 제공해드려요
        </p>
      </header>

      <section className="space-y-3">
        <div>
          <h2 className="mb-1 pl-1 text-[13px] font-semibold text-foreground">
            진로
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {careerOptions.map((career) => (
              <Card
                key={career.id}
                onClick={() => handleSelectCareer(career.id)}
                className={cn(
                  'relative cursor-pointer rounded-[24px] py-0 transition-all active:scale-[0.98]',
                  selectedCareer === career.id
                    ? 'border-primary/50 bg-white ring-2 ring-primary/80'
                    : 'bg-white hover:bg-secondary/40',
                )}
              >
                <div className="p-3">
                  {selectedCareer === career.id && (
                    <div className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <Check className="h-3 w-3 text-primary-foreground" />
                    </div>
                  )}

                  <div className="mt-1 mb-1.5 flex justify-center text-[26px]">
                    {career.icon}
                  </div>

                  <h3 className="text-center text-[13px] font-semibold leading-tight text-foreground">
                    {career.name}
                  </h3>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {isEtcCareer && (
          <div>
            <h2 className="mb-1 pl-1 text-[13px] font-semibold text-foreground">
              진로 직접 작성
            </h2>

            <input
              value={customCareer}
              onChange={(e) => setCustomCareer(e.target.value)}
              placeholder="예: 게임 기획자, 영상 편집자"
              className="h-10 w-full rounded-[20px] border border-slate-200 bg-white px-4 text-[13px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {selectedCareer && !isEtcCareer && (
          <div>
            <h2 className="mb-1 pl-1 text-[13px] font-semibold text-foreground">
              관심 분야
            </h2>

            <div className="flex flex-wrap gap-1.5">
              {currentInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleToggleInterest(interest)}
                  className={cn(
                    'rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all',
                    selectedInterests.includes(interest)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-white text-foreground',
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {isEtcCareer && (
          <div>
            <h2 className="mb-1 pl-1 text-[13px] font-semibold text-foreground">
              관심 분야 직접 작성
            </h2>

            <input
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="예: 게임엔진, 모션그래픽"
              className="h-10 w-full rounded-[20px] border border-slate-200 bg-white px-4 text-[13px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
        )}

        {selectedCareer && (
          <div>
            <h2 className="mb-1 pl-1 text-[13px] font-semibold text-foreground">
              목표
            </h2>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="나만의 목표를 자유롭게 적어보세요"
              className="min-h-[78px] w-full resize-none rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-[13px] outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
            />
          </div>
        )}
      </section>

      <footer className="mt-5 space-y-2.5">
        <p className="text-center text-[12px] text-muted-foreground">
          선택한 진로는 프로필에서 언제든 변경할 수 있어요
        </p>

        <Button
          onClick={handleComplete}
          disabled={!selectedCareer || isSaving}
          className="h-11 w-full rounded-[22px] !bg-[#1792f2] text-[14px] font-semibold !text-white hover:!bg-[#1487df]"
        >
          {isSaving ? '저장 중...' : '선택 완료'}
        </Button>
      </footer>
    </div>
  )
}