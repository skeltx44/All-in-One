import { useState } from 'react'

export function useExpToast() {
  const [expMessage, setExpMessage] = useState('')
  const [isExpToastVisible, setIsExpToastVisible] = useState(false)

  const showExpToast = (amount: number) => {
    setExpMessage(`+${amount} EXP`)
    setIsExpToastVisible(false)

    requestAnimationFrame(() => {
      setIsExpToastVisible(true)
    })

    setTimeout(() => {
      setIsExpToastVisible(false)
    }, 1100)

    setTimeout(() => {
      setExpMessage('')
    }, 2400)
  }

  const toastBaseClass =
    'fixed left-1/2 bottom-24 z-[80] min-w-[120px] -translate-x-1/2 rounded-[18px] border border-[#B9F6D3] bg-[#DDFBEA] px-5 py-3 text-center text-[14px] font-semibold tracking-[-0.03em] text-[#00B86B] shadow-[0_8px_24px_rgba(0,184,107,0.14)] transition-all duration-700 ease-out'

  const ExpToast = expMessage ? (
    <div
      className={
        isExpToastVisible
          ? `${toastBaseClass} translate-y-0 opacity-90`
          : `${toastBaseClass} translate-y-2 opacity-0`
      }
    >
      {expMessage}
    </div>
  ) : null

  return {
    showExpToast,
    ExpToast,
  }
}