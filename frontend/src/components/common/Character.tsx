import { cn } from '@/lib/utils'

interface CharacterProps {
  size?: 'sm' | 'home' | 'md' | 'lg'
  showAnimation?: boolean
  className?: string
  level?: number
}

export function Character({
  size = 'md',
  showAnimation = true,
  className,
  level = 1,
}: CharacterProps) {
  const sizeClasses = {
    sm: 'w-24 h-24',
    home: 'w-42 h-42',
    md: 'w-40 h-40',
    lg: 'w-56 h-56',
  }

  const imageSrc =
    level === 1
      ? '/characters/level1.png'
      : level === 2
        ? '/characters/level2.png'
        : '/characters/level3.png'

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        className
      )}
    >
      <div
        className={cn(
          'absolute rounded-full bg-gradient-to-b from-primary/20 to-mint/20 blur-2xl',
          sizeClasses[size]
        )}
      />

      <div
        className={cn(
          'relative flex items-center justify-center',
          sizeClasses[size],
          showAnimation && 'animate-breathe'
        )}
      >
        <img
          src={imageSrc}
          alt={`Level ${level} character`}
          className="w-full h-full object-contain drop-shadow-xl"
        />
      </div>

      <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
          Lv.{level}
      </div>

      <div className="absolute -top-4 -left-2 text-2xl animate-pulse-soft">
        ✨
      </div>

      <div className="absolute -bottom-2 -right-4 text-xl animate-pulse-soft delay-150">
        ⭐
      </div>
    </div>
  )
}