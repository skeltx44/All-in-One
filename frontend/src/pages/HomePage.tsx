import { Character } from '@/components/common/Character'
import { ExpBar } from '@/components/common/ExpBar'
import { MenuCard } from '@/components/common/MenuCard'
import { userData } from '@/data/dummy'
import { Sparkles, BookOpen, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HomePage() {
  return (
    <div className="min-h-screen px-4 pt-12 safe-area-top">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">All in One</h1>
        <p className="text-muted-foreground text-sm text-balance">
          당신의 꿈을 향한 여정을 함께합니다
        </p>
      </header>

      {/* Character Section */}
      <section className="flex flex-col items-center mb-8">
        <Link to="/character">
          <Character size="lg" />
        </Link>
        
        <div className="mt-6 w-full max-w-xs">
          <ExpBar />
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          {userData.career} 준비중 ✨
        </p>
      </section>

      {/* Menu Cards */}
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
