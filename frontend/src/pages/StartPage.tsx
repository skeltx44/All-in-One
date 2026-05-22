import { useState } from 'react'
import { useNavigate, useLocation  } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { careerOptions } from '@/data/dummy'
import { Check } from 'lucide-react'
import { addActivity } from '@/lib/addActivity'

const interestOptions: Record<string, string[]> = {
  ai: ['AI', '데이터분석', '웹개발', '앱개발'],
  design: ['UI/UX', '그래픽', '브랜딩', '3D'],
  semiconductor: ['회로설계', '공정', '소자', '장비'],
  marketing: ['콘텐츠', '브랜딩', 'SNS', '시장분석'],
  finance: ['회계', '투자', '세무', '재무분석'],
  etc: ['기획', '창업', '연구', '미정'],
}

export function StartPage() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([])
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

  const handleSelectCareer = (careerId: string) => {
    setSelectedCareer(careerId)
    setSelectedInterests([])
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

    const user = JSON.parse(savedUser)

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
            selected_career: selectedCareerData.name,
            interest_field: selectedInterests.join(','),
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
    <div className="min-h-screen px-4 pt-16 pb-8 safe-area-top safe-area-bottom flex flex-col">
      <header className="text-center mb-10">
        <h1 className="text-2xl font-bold text-foreground mb-3">
          관심 진로를 선택하세요
        </h1>
        <p className="text-muted-foreground text-sm">
          선택한 진로에 맞춤 정보를 제공해드려요
        </p>
      </header>

      <section className="space-y-8 flex-1">
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3">
            진로
          </h2>

          <div className="grid grid-cols-2 gap-3">
            {careerOptions.map((career) => (
              <Card
                key={career.id}
                onClick={() => handleSelectCareer(career.id)}
                className={cn(
                  'relative p-5 cursor-pointer transition-all',
                  'hover:shadow-md active:scale-[0.98]',
                  selectedCareer === career.id
                    ? 'ring-2 ring-primary bg-primary/5'
                    : 'hover:bg-secondary/50'
                )}
              >
                {selectedCareer === career.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}

                <div className="text-3xl mb-3">{career.icon}</div>
                <h3 className="font-semibold text-foreground">
                  {career.name}
                </h3>
              </Card>
            ))}
          </div>
        </div>

        {selectedCareer && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              관심 분야
            </h2>

            <div className="flex flex-wrap gap-2">
              {currentInterests.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleToggleInterest(interest)}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm border transition-all',
                    selectedInterests.includes(interest)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-foreground border-border'
                  )}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedCareer && (
          <div>
            <h2 className="text-sm font-semibold text-foreground mb-3">
              목표
            </h2>

            <textarea
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="예: AI 기반 진로 플랫폼 개발"
              className="w-full min-h-28 rounded-2xl border border-input bg-card px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground resize-none"
            />
          </div>
        )}
      </section>

      <footer className="mt-8 space-y-4">
        <p className="text-center text-xs text-muted-foreground">
          선택한 진로는 프로필에서 언제든 변경할 수 있어요
        </p>

        <Button
          onClick={handleComplete}
          disabled={!selectedCareer || isSaving}
          className="w-full"
          size="lg"
        >
          {isSaving ? '저장 중...' : '선택 완료'}
        </Button>
      </footer>
    </div>
  )
}