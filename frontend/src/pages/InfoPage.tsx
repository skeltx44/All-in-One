import { API_BASE_URL } from "@/lib/api";
import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Search, X } from 'lucide-react'
import { useExpToast } from '@/components/common/useExpToast'
import { useLevelUpModal } from '@/components/common/useLevelUpModal'

type InfoItem = {
  id: number
  title: string
  category: string
  description: string
  deadline: string
  fields: string
}

const categories = ['전체', '공모전', '자격증', '인턴', '시험']

export function InfoPage() {
  const [infoItems, setInfoItems] = useState<InfoItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [searchText, setSearchText] = useState('')
  const [selectedInfo, setSelectedInfo] = useState<InfoItem | null>(null)
  const [toastMessage, setToastMessage] = useState('')
  const [toastType, setToastType] = useState<'success' | 'error'>('success')
  const [isToastVisible, setIsToastVisible] = useState(false)

  const { showExpToast, ExpToast } = useExpToast()
  const { showLevelUp, LevelUpModal } = useLevelUpModal()

  const addCharacterExp = async (
    amount: number,
    activityType: string,
    description: string
  ) => {
    const savedUser = localStorage.getItem('user')

   if (!savedUser) return null

    const user = JSON.parse(savedUser)

    const res = await fetch(`${API_BASE_URL}/api/db/characters/${user.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activity_type: activityType,
        description,
        exp_amount: amount,
      }),
})

return await res.json()
  }

  useEffect(() => {
    fetchInfoItems()
  }, [])

  const fetchInfoItems = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/db/info-items`)
      const data = await res.json()
      setInfoItems(data)
    } catch (err) {
      console.error('정보 불러오기 실패:', err)
    }
  }

  const calculateDaysLeft = (deadline: string) => {
    const today = new Date()
    const endDate = new Date(deadline)
    const diffTime = endDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  const showToast = (
    message: string,
    type: 'success' | 'error'
  ) => {
    setToastMessage(message)
    setToastType(type)
    setIsToastVisible(false)

    requestAnimationFrame(() => {
      setIsToastVisible(true)
    })

    setTimeout(() => {
      setIsToastVisible(false)
    }, 1100)

    setTimeout(() => {
      setToastMessage('')
    }, 2400)
  }

  const handleSaveInfo = async () => {
    if (!selectedInfo) return

    try {
      const savedUser = localStorage.getItem('user')

      if (!savedUser) return

      const user = JSON.parse(savedUser)

      const res = await fetch(
        `${API_BASE_URL}/api/db/scraps`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: user.id,
            info_item_id: selectedInfo.id,
          }),
        }
      )

      const data = await res.json()

      if (!res.ok) {
        showToast(data.error || '스크랩 저장 실패', 'error')
        return
      }

      const expResult = await addCharacterExp(5, 'scrap', '관심 정보 저장')

      setSelectedInfo(null)

      showToast('관심 정보가 저장되었어요', 'success')
      showExpToast(5)

      if (expResult?.leveled_up) {
        setTimeout(() => {
          showLevelUp(expResult.previous_level, expResult.new_level)
        }, 1200)
      }
      
    } catch (err) {
      console.error(err)
      showToast('서버 오류가 발생했어요', 'error')
    }
  }

  const filteredItems = infoItems.filter((item) => {
    const matchesCategory =
      selectedCategory === '전체' || item.category === selectedCategory

    const matchesSearch =
      item.title.includes(searchText) ||
      item.description.includes(searchText) ||
      item.fields.includes(searchText)

    return matchesCategory && matchesSearch
  })

  return (
    <div className="relative px-4 pt-5">
      <header className="mb-4 pl-2">
        <h1 className="mb-1 text-xl font-bold text-foreground">
          진로 정보
        </h1>
        <p className="text-[13px] text-muted-foreground">
          자격증, 인턴, 공모전, 시험 정보를 확인해보세요
        </p>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="관심 정보를 검색해보세요"
          className="w-full rounded-2xl border border-input bg-white px-4 py-3 pl-10 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="-mx-4 mb-1 overflow-x-auto px-5 pb-2 scrollbar-hide">
        <div className="flex w-max gap-1.5">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={
                selectedCategory === category
                  ? 'shrink-0 rounded-full bg-primary px-3.5 py-1.5 text-[13px] font-medium text-primary-foreground'
                  : 'shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-[13px] font-medium text-foreground'
              }
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2.5 pb-24">
        {filteredItems.map((item) => {
          const daysLeft = calculateDaysLeft(item.deadline)
          const fields = item.fields
            ? item.fields.split(',').map((field) => field.trim())
            : []

          return (
            <Card
              key={item.id}
              onClick={() => setSelectedInfo(item)}
              className="cursor-pointer rounded-[18px] py-0 active:scale-[0.99]"
            >
              <CardContent className="p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <Badge
                    variant="secondary"
                    className="-ml-1 h-5 px-1.5 text-[10px] font-medium"
                  >
                    {item.category}
                  </Badge>

                  <span className="shrink-0 text-[13px] font-semibold text-primary">
                    D-{daysLeft}
                  </span>
                </div>

                <h3 className="mb-1.5 line-clamp-1 text-[14px] font-semibold leading-tight text-foreground">
                  {item.title}
                </h3>

                <p className="mb-2 line-clamp-2 text-[12px] leading-[1.45] text-muted-foreground">
                  {item.description}
                </p>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 flex-wrap gap-1">
                    {fields.slice(0, 3).map((field, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="h-5 px-1.5 text-[10px]"
                      >
                        {field}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex shrink-0 items-center gap-1 text-[10px] text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{item.deadline.slice(0, 10)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredItems.length === 0 && (
          <p className="pt-10 text-center text-sm text-muted-foreground">
            표시할 정보가 없어요.
          </p>
        )}
      </div>

      {selectedInfo && (
        <>
          <div
            onClick={() => setSelectedInfo(null)}
            className="fixed inset-0 z-40 bg-slate-950/20"
          />

          <div className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-32px)] -translate-x-1/2 -translate-y-1/2 rounded-[26px] bg-white p-4 shadow-[0_12px_36px_rgba(73,105,140,0.24)]">
            <button
              type="button"
              onClick={() => setSelectedInfo(null)}
              className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="pr-8 text-[16px] font-semibold tracking-[-0.03em] text-slate-950">
              {selectedInfo.title}
            </h3>

            <p className="mt-1 text-[13px] leading-relaxed text-slate-500">
              이 정보를 관심 목록에 저장할까요?
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedInfo(null)}
                className="h-10 rounded-2xl bg-slate-100 text-[14px] font-semibold text-slate-500 active:scale-[0.98]"
              >
                취소
              </button>

              <button
                type="button"
                onClick={handleSaveInfo}
                className="h-10 rounded-2xl bg-primary text-[14px] font-semibold text-primary-foreground active:scale-[0.98]"
              >
                저장
              </button>
            </div>
          </div>
        </>
      )}

      {toastMessage && (
        <div
          className={
            isToastVisible
              ? `fixed left-1/2 top-8 z-[60] w-[270px] -translate-x-1/2 translate-y-0 rounded-[18px] px-5 py-3 text-center text-[14px] font-semibold tracking-[-0.03em] opacity-90 transition-all duration-700 ease-out ${
                  toastType === 'success'
                    ? 'border border-[#B9F6D3] bg-[#DDFBEA] text-[#00B86B] shadow-[0_8px_24px_rgba(0,184,107,0.14)]'
                    : 'border border-rose-200 bg-rose-100 text-rose-700 shadow-[0_8px_24px_rgba(190,70,90,0.12)]'
                }`
              : `fixed left-1/2 top-8 z-[60] w-[270px] -translate-x-1/2 -translate-y-1 rounded-[18px] px-5 py-3 text-center text-[14px] font-semibold tracking-[-0.03em] opacity-0 transition-all duration-700 ease-out ${
                  toastType === 'success'
                    ? 'border border-[#B9F6D3] bg-[#DDFBEA] text-[#00B86B] shadow-[0_8px_24px_rgba(0,184,107,0.14)]'
                    : 'border border-rose-200 bg-rose-100 text-rose-700 shadow-[0_8px_24px_rgba(190,70,90,0.12)]'
                }`
          }
        >
          {toastMessage}
        </div>
      )}
      {ExpToast}
      {LevelUpModal}
    </div>
  )
}