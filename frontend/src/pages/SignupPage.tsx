import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { UserPlus } from 'lucide-react'

export function SignupPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!form.email || !form.password || !form.nickname) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    try {
      setLoading(true)

      const res = await fetch('http://localhost:4000/api/db/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '회원가입에 실패했습니다.')
      }

      localStorage.setItem('user', JSON.stringify(data))
      navigate('/start?mode=signup')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 pt-12 safe-area-top flex flex-col">
      <header className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <UserPlus className="h-7 w-7" />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          회원가입
        </h1>

        <p className="text-muted-foreground text-sm text-balance">
          All in One에서 나만의 진로 여정을 시작해보세요
        </p>
      </header>

      <main className="w-full max-w-sm mx-auto">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              이름
            </label>
            <input
              name="nickname"
              value={form.nickname}
              onChange={handleChange}
              placeholder="이름"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              이메일
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              비밀번호
            </label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호"
              className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-gray-400"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted-foreground">
          이미 계정이 있나요?{' '}
          <Link to="/login" className="font-medium text-foreground underline">
            로그인
          </Link>
        </p>
      </main>
    </div>
  )
}