import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Bookmark, BookmarkCheck, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

const infoCategories = ['전체', '자격증', '인턴', '공모전', '시험']

type InfoItem = {
  id: number
  title: string
  category: string
  description: string
  deadline: string
  daysLeft: number
  fields: string[]
  saved: boolean
}

export function InfoPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [infoItems, setInfoItems] = useState<InfoItem[]>([])
  const [savedItems, setSavedItems] = useState<number[]>([])

  useEffect(() => {
    fetchInfoItems()
  }, [])

  const fetchInfoItems = async () => {
    const res = await fetch('http://localhost:4000/api/infoItems')
    const data: InfoItem[] = await res.json()

    setInfoItems(data)
    setSavedItems(data.filter((item) => item.saved).map((item) => item.id))
  }

  const filteredItems = infoItems.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())

    const matchesCategory =
      selectedCategory === '전체' || item.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const toggleSave = (id: number) => {
    setSavedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    )
  }

  const getCategoryVariant = (
    category: string
  ): 'default' | 'mint' | 'peach' | 'lavender' => {
    switch (category) {
      case '자격증':
        return 'lavender'
      case '인턴':
        return 'mint'
      case '공모전':
        return 'peach'
      default:
        return 'default'
    }
  }

  return (
    <div className="min-h-screen px-4 pt-12 pb-8 safe-area-top">
      <header className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-2">정보</h1>
        <p className="text-sm text-muted-foreground">
          자격증 · 인턴 · 공모전 · 시험 정보
        </p>
      </header>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3 mb-4">
        {infoCategories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className="flex-shrink-0"
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getCategoryVariant(item.category)}>
                      {item.category}
                    </Badge>

                    {item.daysLeft <= 7 && (
                      <Badge
                        variant="default"
                        className="bg-destructive text-destructive-foreground"
                      >
                        마감임박
                      </Badge>
                    )}
                  </div>

                  <h3 className="font-semibold text-foreground mb-1 truncate">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {item.deadline}
                    </span>
                    <span>D-{item.daysLeft}</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.fields.map((field, index) => (
                      <span
                        key={index}
                        className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded-full"
                      >
                        #{field}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => toggleSave(item.id)}
                  className={cn(
                    'p-2 rounded-full transition-colors',
                    savedItems.includes(item.id)
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:bg-secondary'
                  )}
                >
                  {savedItems.includes(item.id) ? (
                    <BookmarkCheck className="h-5 w-5" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">검색 결과가 없습니다</p>
          </div>
        )}
      </div>
    </div>
  )
}