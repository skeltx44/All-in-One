import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'

export function Layout() {
  const location = useLocation()

  const hideBottomNav =
    location.pathname === '/start' ||
    location.pathname === '/login' ||
    location.pathname === '/signup' ||
    location.pathname === '/attendance'

  return (
    <div className="bg-background">
      <div className="mobile-screen relative overflow-hidden bg-[linear-gradient(180deg,#eef8ff_0%,#f8fbff_55%,#edf5ff_100%)]">
        <main className="h-full overflow-y-auto scrollbar-hide">
          <Outlet />
        </main>

        {!hideBottomNav && <BottomNav />}
      </div>
    </div>
  )
}