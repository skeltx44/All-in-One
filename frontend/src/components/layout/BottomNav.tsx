import { NavLink, useLocation } from 'react-router-dom'
import {
  Home,
  Sparkles,
  BookOpen,
  MessageCircle,
  User,
} from 'lucide-react'

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

  if (location.pathname === '/start') {
    return null
  }

  return (
    <nav className="pointer-events-none absolute bottom-0 left-0 right-0 z-50 pb-4">
      <div className="pointer-events-auto mx-2.5 flex h-[70px] items-center justify-between rounded-[30px] border border-slate-100 bg-white px-3 shadow-[0_10px_28px_rgba(67,102,146,0.14)]">
        {navItems.map(({ path, icon: Icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center justify-center gap-[4px] rounded-2xl py-2 transition-all duration-200',
                isActive
                  ? 'text-primary'
                  : 'text-slate-500 hover:text-slate-700',
              )
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200',
                    isActive &&
                      'bg-gradient-to-b from-blue-100 to-blue-50 shadow-inner',
                  )}
                >
                  <Icon
                    className={cn(
                      'h-[20px] w-[20px]',
                      isActive ? 'scale-110' : 'scale-100',
                    )}
                    strokeWidth={isActive ? 2 : 1.7}
                  />
                </div>

                <span
                  className={cn(
                    'whitespace-nowrap text-[10px] font-medium tracking-[-0.03em]',
                    isActive && 'font-semibold',
                  )}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}