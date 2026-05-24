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
    <div className="px-4 pt-5">
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
            <Card key={item.id} className="rounded-[18px] py-0">
              <CardContent className="p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <Badge variant="secondary" className="-ml-1 h-5 px-1.5 text-[10px] font-medium">
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
    </div>
  )
}