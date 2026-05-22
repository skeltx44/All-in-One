import { Progress } from '@/components/ui/progress'

interface ExpBarProps {
  exp: number
  maxExp: number
  level: number
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function ExpBar({
  exp,
  maxExp,
  level,
  showLabel = true,
  size = 'md',
}: ExpBarProps) {
  const isMaxLevel = level >= 3
  const displayExp = isMaxLevel ? maxExp : Math.min(exp, maxExp)
  const percentage = isMaxLevel
    ? 100
    : Math.min(Math.round((displayExp / maxExp) * 100), 100)

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Lv.{level}
          </span>

          <span className="text-sm font-medium text-primary">
            {isMaxLevel ? 'MAX LEVEL' : `${displayExp} / ${maxExp} EXP`}
          </span>
        </div>
      )}

      <Progress
        value={percentage}
        className={size === 'sm' ? 'h-2' : 'h-3'}
      />

      {showLabel && (
        <div className="text-center mt-1">
          <span className="text-xs text-muted-foreground">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  )
}