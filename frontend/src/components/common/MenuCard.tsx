import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface MenuCardProps {
  title: string
  description?: string
  icon: React.ReactNode
  to: string
  color?: string
}

export function MenuCard({ title, description, icon, to, color }: MenuCardProps) {
  return (
    <Link to={to}>
      <Card
        className={cn(
          'flex items-center gap-4 hover:shadow-md transition-all active:scale-[0.98]',
          color
        )}
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground truncate">{description}</p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
      </Card>
    </Link>
  )
}
