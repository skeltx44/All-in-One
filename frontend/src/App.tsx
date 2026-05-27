import type { ReactNode } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'
import { SignupPage } from '@/pages/SignupPage'
import { LoginPage } from '@/pages/LoginPage'
import { HomePage } from '@/pages/HomePage'
import { StartPage } from '@/pages/StartPage'
import { SimulationPage } from '@/pages/SimulationPage'
import { InfoPage } from '@/pages/InfoPage'
import { CommunityPage } from '@/pages/CommunityPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { CharacterPage } from '@/pages/CharacterPage'
import { AttendancePage } from '@/pages/AttendancePage'

function RequireAuth({ children }: { children: ReactNode }) {
  const savedUser = localStorage.getItem('user')

  if (!savedUser || savedUser === 'undefined') {
    return <Navigate to="/login" replace />
  }

  try {
    JSON.parse(savedUser)
  } catch {
    localStorage.removeItem('user')
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route
          index
          element={
            <RequireAuth>
              <HomePage />
            </RequireAuth>
          }
        />

        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />

        <Route
          path="start"
          element={
            <RequireAuth>
              <StartPage />
            </RequireAuth>
          }
        />

        <Route
          path="simulation"
          element={
            <RequireAuth>
              <SimulationPage />
            </RequireAuth>
          }
        />

        <Route
          path="info"
          element={
            <RequireAuth>
              <InfoPage />
            </RequireAuth>
          }
        />

        <Route
          path="community"
          element={
            <RequireAuth>
              <CommunityPage />
            </RequireAuth>
          }
        />

        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />

        <Route
          path="character"
          element={
            <RequireAuth>
              <CharacterPage />
            </RequireAuth>
          }
        />

        <Route
          path="attendance"
          element={
            <RequireAuth>
              <AttendancePage />
            </RequireAuth>
          }
        />
      </Route>
    </Routes>
  )
}