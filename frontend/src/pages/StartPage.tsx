import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { careerOptions } from '@/data/dummy'
import { Check } from 'lucide-react'

export function StartPage() {
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const navigate = useNavigate()

  const handleComplete = async () => {
    if (!selectedCareer) return

    const selectedCareerData = careerOptions.find(
      (career) => career.id === selectedCareer
    )

    if (!selectedCareerData) return

    setIsSaving(true)

    const res = await fetch('http://localhost:4000/api/users', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        career: selectedCareerData.name,
      }),
    })

    if (res.ok) {
      navigate('/profile')
    }

    setIsSaving(false)
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

      <section className="flex-1">
        <div className="grid grid-cols-2 gap-3">
          {careerOptions.map((career) => (
            <Card
              key={career.id}
              onClick={() => setSelectedCareer(career.id)}
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
              <h3 className="font-semibold text-foreground">{career.name}</h3>
            </Card>
          ))}
        </div>
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