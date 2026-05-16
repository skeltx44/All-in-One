import { NavLink, useLocation } from 'react-router-dom'
import { Home, Sparkles, BookOpen, MessageCircle, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', icon: Home, label: '홈' },
  { path: '/simulation', icon: Sparkles, label: '시뮬레이션' },
  { path: '/info', icon: BookOpen, label: '정보' },
  { path: '/community', icon: MessageCircle, label: '소통' },
  { path: '/profile', icon: User, label: '프로필' },
]

export function BottomNav() {
  const location = useLocation()

  // Hide bottom nav on start page
  if (location.pathname === '/start') {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border/50 safe-area-bottom">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={cn(
                      'p-2 rounded-xl transition-all',
                      isActive && 'bg-primary/10'
                    )}
                  >
                    <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="text-xs font-medium">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  )
}
