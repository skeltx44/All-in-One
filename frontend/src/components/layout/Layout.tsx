import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  const location = useLocation()
  const isStartPage = location.pathname === '/start'

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md min-h-screen relative">
        <main className={isStartPage ? '' : 'pb-24'}>
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}
