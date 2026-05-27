import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function SignupPage() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nickname, setNickname] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await fetch('http://localhost:4000/api/db/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          nickname,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '회원가입에 실패했습니다.')
        return
      }

      localStorage.setItem('user', JSON.stringify(data.user))
      navigate('/start?mode=signup')
    } catch (err) {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="px-5 pt-10">
      <header className="mb-6 pl-1">
        <h1 className="mb-1 text-xl font-bold text-foreground">
          회원가입
        </h1>
        <p className="text-[13px] text-muted-foreground">
          나만의 진로 여정을 시작해보세요
        </p>
      </header>

      <form
        onSubmit={handleSignup}
        className="rounded-[30px] bg-white px-4 py-5 shadow-[0_10px_28px_rgba(67,102,146,0.14)]"
      >
        <div className="space-y-3">
          <input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="h-11 w-full rounded-[22px] border border-slate-200 bg-white px-4 text-[13px] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-ring"
          />

          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 w-full rounded-[22px] border border-slate-200 bg-white px-4 text-[13px] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-ring"
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 w-full rounded-[22px] border border-slate-200 bg-white px-4 text-[13px] outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-ring"
          />
        </div>

        {error && (
          <p className="mt-3 pl-1 text-[12px] text-destructive">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 h-11 w-full rounded-[22px] bg-[#1792f2] text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(23,146,242,0.24)] disabled:opacity-60"
        >
          {isLoading ? '가입 중...' : '회원가입'}
        </button>
      </form>

      <p className="mt-5 text-center text-[13px] text-muted-foreground">
        이미 계정이 있나요?{' '}
        <Link to="/login" className="font-semibold text-primary">
          로그인
        </Link>
      </p>
    </div>
  )
}