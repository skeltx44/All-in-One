import { cn } from '@/lib/utils'
import { userData, growthStages } from '@/data/dummy'

interface CharacterProps {
  size?: 'sm' | 'md' | 'lg'
  showAnimation?: boolean
  className?: string
}

export function Character({ size = 'md', showAnimation = true, className }: CharacterProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  }

  const currentStage = growthStages.filter((s) => s.level <= userData.level).pop()

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        showAnimation && 'animate-float',
        className
      )}
    >
      {/* Glow effect */}
      <div
        className={cn(
          'absolute rounded-full bg-gradient-to-b from-primary/20 to-mint/20 blur-2xl',
          sizeClasses[size]
        )}
      />
      
      {/* Character body */}
      <div
        className={cn(
          'relative rounded-full bg-gradient-to-b from-white to-sky-medium flex items-center justify-center shadow-lg border-4 border-white/50',
          sizeClasses[size]
        )}
      >
        {/* Face */}
        <div className="relative">
          {/* Eyes */}
          <div className="flex gap-4 mb-2">
            <div className="w-3 h-4 bg-foreground rounded-full" />
            <div className="w-3 h-4 bg-foreground rounded-full" />
          </div>
          {/* Mouth */}
          <div className="w-8 h-4 border-b-4 border-foreground rounded-b-full mx-auto" />
        </div>
        
        {/* Level badge */}
        <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Lv.{userData.level}
        </div>
      </div>
      
      {/* Sparkles */}
      <div className="absolute -top-4 -left-2 text-2xl animate-pulse-soft">✨</div>
      <div className="absolute -bottom-2 -right-4 text-xl animate-pulse-soft delay-150">⭐</div>
    </div>
  )
}
