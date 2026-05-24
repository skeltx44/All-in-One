import { Routes, Route } from 'react-router-dom'
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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="start" element={<StartPage />} />
        <Route path="simulation" element={<SimulationPage />} />
        <Route path="info" element={<InfoPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="character" element={<CharacterPage />} />
      </Route>
    </Routes>
  )
}