import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, CalendarCheck, Stamp } from 'lucide-react'
import { useExpToast } from '@/components/common/useExpToast'
import { useLevelUpModal } from '@/components/common/useLevelUpModal'

const weekDays = ['일', '월', '화', '수', '목', '금', '토']

const getTodayKey = () => {
  const today = new Date()
  return today.toISOString().slice(0, 10)
}

const getWeekStart = () => {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - today.getDay())
  start.setHours(0, 0, 0, 0)
  return start
}

const getWeekDates = () => {
  const start = getWeekStart()

  return weekDays.map((day, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)

    return {
      day,
      key: date.toISOString().slice(0, 10),
      date: date.getDate(),
    }
  })
}

export function AttendancePage() {
  const [attendedDates, setAttendedDates] = useState<string[]>([])
  const [isStamping, setIsStamping] = useState(false)
  
  const { showExpToast, ExpToast } = useExpToast()
  const { showLevelUp, LevelUpModal } = useLevelUpModal()

  const addCharacterExp = async (
    amount: number,
    activityType: string,
    description: string
  ) => {
    const savedUser = localStorage.getItem('user')

    if (!savedUser) return null

    const user = JSON.parse(savedUser)

    const res = await fetch(`http://localhost:4000/api/db/characters/${user.id}/activities`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        activity_type: activityType,
        description,
        exp_amount: amount,
      }),
})

return await res.json()
  }

  const todayKey = getTodayKey()
  const weekDates = getWeekDates()
  const isTodayAttended = attendedDates.includes(todayKey)

  useEffect(() => {
    const saved = localStorage.getItem('attendanceDates')
    if (saved) {
      setAttendedDates(JSON.parse(saved))
    }
  }, [])

  const handleAttendance = async () => {
    if (isTodayAttended) return

    setIsStamping(true)

    const nextDates = [...attendedDates, todayKey]
    setAttendedDates(nextDates)
    localStorage.setItem('attendanceDates', JSON.stringify(nextDates))

    const expResult = await addCharacterExp(10, 'attendance', '출석 스탬프')
    showExpToast(10)

    if (expResult?.leveled_up) {
      setTimeout(() => {
        showLevelUp(expResult.previous_level, expResult.new_level)
      }, 1200)
    }

    setTimeout(() => {
      setIsStamping(false)
    }, 450)
  }

  return (
    <div className="h-screen overflow-hidden px-4 pt-5 pb-32">
      <header className="mb-3">
        <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
            <ArrowLeft className="h-4 w-4" />
            <span>돌아가기</span>
        </Link>
        </header>

      <section className="mb-3 text-center">
        <p className="text-[14px] font-medium text-primary">
          성장 스탬프
        </p>
        <h2 className="mt-1 text-[22px] font-bold tracking-[-0.04em] text-slate-950">
          오늘도 꿈에 한 걸음
        </h2>
        <p className="mt-1 text-[13px] text-muted-foreground">
          하루 한 번 출석하고 성장 기록을 남겨보세요
        </p>
      </section>

      <Card className="mb-4 rounded-[30px] py-0">
        <CardContent className="flex flex-col items-center px-4 py-7">
          <div
            className={
              isStamping
                ? 'mb-5 flex h-28 w-28 scale-110 rotate-[-8deg] items-center justify-center rounded-full border-4 border-primary bg-primary/10 text-primary shadow-[0_10px_28px_rgba(73,105,140,0.18)] transition-all duration-300'
                : 'mb-5 flex h-28 w-28 items-center justify-center rounded-full border-4 border-primary bg-primary/10 text-primary shadow-[0_10px_28px_rgba(73,105,140,0.18)] transition-all duration-300'
            }
          >
            {isTodayAttended ? (
              <div className="text-center">
                <CalendarCheck className="mx-auto h-9 w-9" strokeWidth={1.8} />
                <p className="mt-1 text-[13px] font-bold">완료</p>
              </div>
            ) : (
              <Stamp className="h-11 w-11" strokeWidth={1.7} />
            )}
          </div>

          <h3 className="text-[17px] font-semibold tracking-[-0.03em] text-foreground">
            {isTodayAttended ? '오늘 출석 완료' : '출석 스탬프를 찍어보세요'}
          </h3>

          <p className="mt-1 text-[13px] text-muted-foreground">
            {isTodayAttended
              ? '출석 기록에 스탬프가 추가되었어요'
              : '버튼을 누르면 오늘의 출석이 기록돼요'}
          </p>

          <button
            type="button"
            onClick={handleAttendance}
            disabled={isTodayAttended}
            className={
              isTodayAttended
                ? 'mt-5 h-11 w-full rounded-2xl bg-slate-200 text-[14px] font-semibold text-slate-500'
                : 'mt-5 h-11 w-full rounded-2xl bg-primary text-[14px] font-semibold text-primary-foreground active:scale-[0.98]'
            }
          >
            {isTodayAttended ? '오늘은 이미 출석했어요' : '출석 스탬프 찍기'}
          </button>
        </CardContent>
      </Card>

      <Card className="rounded-[30px] py-0">
        <CardContent className="px-4 py-4">
          <div className="mb-3">
            <h3 className="text-[15px] font-semibold tracking-[-0.03em] text-foreground">
              이번 주 출석 기록
            </h3>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              꾸준히 성장하는 중이에요
            </p>
          </div>

          <div className="grid grid-cols-7 gap-1.5">
            {weekDates.map((item) => {
              const checked = attendedDates.includes(item.key)

              return (
                <div key={item.key} className="flex flex-col items-center">
                  <p className="mb-1 text-[11px] font-medium text-muted-foreground">
                    {item.day}
                  </p>

                  <div
                    className={
                      checked
                        ? 'flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm'
                        : 'flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm'
                    }
                  >
                    {checked ? (
                      <Stamp className="h-4 w-4" strokeWidth={1.8} />
                    ) : (
                      <span className="text-[12px] font-medium">{item.date}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      {ExpToast}
      {LevelUpModal}
    </div>
  )
}