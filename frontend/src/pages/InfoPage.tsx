import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Search } from 'lucide-react'

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

  useEffect(() => {
    fetchInfoItems()
  }, [])

  const fetchInfoItems = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/db/info-items')
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
    <div className="min-h-screen px-4 pt-12 pb-24 safe-area-top">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-2">
          진로 정보
        </h1>
        <p className="text-sm text-muted-foreground">
          자격증, 인턴, 공모전, 시험 정보를 확인해보세요
        </p>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="관심 정보를 검색해보세요"
          className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={
              selectedCategory === category
                ? 'shrink-0 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground'
                : 'shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm text-foreground'
            }
          >
            {category}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => {
          const daysLeft = calculateDaysLeft(item.deadline)
          const fields = item.fields
            ? item.fields.split(',').map((field) => field.trim())
            : []

          return (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>

                    <h3 className="font-semibold text-foreground">
                      {item.title}
                    </h3>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-primary">
                    D-{daysLeft}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {fields.map((field, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {field}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>마감일 {item.deadline.slice(0, 10)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredItems.length === 0 && (
          <p className="text-center text-sm text-muted-foreground pt-10">
            표시할 정보가 없어요.
          </p>
        )}
      </div>
    </div>
  )
}