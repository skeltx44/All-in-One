import { useState } from 'react'
import { Character } from '@/components/common/Character'

export function useLevelUpModal() {
  const [levelUpData, setLevelUpData] = useState<{
    previousLevel: number
    newLevel: number
  } | null>(null)

  const showLevelUp = (previousLevel: number, newLevel: number) => {
    setLevelUpData({
      previousLevel,
      newLevel,
    })
  }

  const closeLevelUp = () => {
    setLevelUpData(null)
  }

  const LevelUpModal = levelUpData ? (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/35 px-5">
      <div className="w-full max-w-[320px] rounded-[30px] bg-white px-5 py-6 text-center shadow-[0_18px_50px_rgba(15,23,42,0.22)] animate-in fade-in zoom-in-95 duration-300">
        <p className="text-[13px] font-semibold text-[#00B86B]">
          LEVEL UP
        </p>

        <h2 className="mt-1 text-[20px] font-bold tracking-[-0.04em] text-slate-950">
          캐릭터 레벨이 올랐어요
        </h2>

        <p className="mt-1 text-[13px] text-slate-500">
          Lv.{levelUpData.previousLevel}에서 Lv.{levelUpData.newLevel}로 성장했어요
        </p>

        <div className="relative mt-5 flex h-[230px] items-center justify-center overflow-hidden">
          <div className="absolute animate-[levelOut_1.2s_ease-in-out_forwards]">
            <Character size="home" level={levelUpData.previousLevel} />
          </div>

          <div className="absolute animate-[levelIn_1.2s_ease-in-out_0.85s_both]">
            <Character size="home" level={levelUpData.newLevel} />
          </div>
        </div>

        <button
          type="button"
          onClick={closeLevelUp}
          className="mt-5 h-11 w-full rounded-[22px] bg-primary text-[14px] font-semibold text-primary-foreground active:scale-[0.98]"
        >
          확인
        </button>
      </div>
    </div>
  ) : null

  return {
    showLevelUp,
    LevelUpModal,
  }
}