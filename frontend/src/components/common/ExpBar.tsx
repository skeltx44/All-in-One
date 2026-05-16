import { Progress } from '@/components/ui/progress'
import { userData } from '@/data/dummy'

interface ExpBarProps {
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function ExpBar({ showLabel = true, size = 'md' }: ExpBarProps) {
  const percentage = Math.round((userData.exp / userData.maxExp) * 100)

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Lv.{userData.level}
          </span>
          <span className="text-sm font-medium text-primary">
            {userData.exp} / {userData.maxExp} EXP
          </span>
        </div>
      )}
      <Progress
        value={percentage}
        className={size === 'sm' ? 'h-2' : 'h-3'}
      />
      {showLabel && (
        <div className="text-center mt-1">
          <span className="text-xs text-muted-foreground">{percentage}%</span>
        </div>
      )}
    </div>
  )
}
