import { Progress } from '@/components/ui/progress'

interface ExpBarProps {
  exp: number
  level: number
  showLabel?: boolean
  size?: 'sm' | 'md'
}

export function ExpBar({
  exp,
  level,
  showLabel = true,
  size = 'md',
}: ExpBarProps) {
  const isMaxLevel = level >= 3

  const levelStartExp = level === 1 ? 0 : level === 2 ? 20 : 50
  const levelTargetExp = level === 1 ? 20 : level === 2 ? 50 : 50

  const progressExp = Math.max(exp - levelStartExp, 0)
  const progressMaxExp = levelTargetExp - levelStartExp

  const percentage = isMaxLevel
    ? 100
    : Math.min(Math.round((progressExp / progressMaxExp) * 100), 100)

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-muted-foreground">
            Lv.{level}
          </span>

          <span className="text-sm font-medium text-primary">
            {isMaxLevel ? 'MAX LEVEL' : `${exp} / ${levelTargetExp} EXP`}
          </span>
        </div>
      )}

      <Progress
        value={percentage}
        className={size === 'sm' ? 'h-2' : 'h-3'}
      />

      {showLabel && (
        <div className="mt-1 flex justify-end">
          <span className="text-xs text-muted-foreground">
            {percentage}%
          </span>
        </div>
      )}
    </div>
  )
}