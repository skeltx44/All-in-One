import { cn } from '@/lib/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'mint' | 'peach' | 'lavender'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        {
          'bg-primary text-primary-foreground': variant === 'default',
          'bg-secondary text-secondary-foreground': variant === 'secondary',
          'border border-border bg-transparent text-foreground': variant === 'outline',
          'bg-mint text-accent-foreground': variant === 'mint',
          'bg-peach text-secondary-foreground': variant === 'peach',
          'bg-lavender text-secondary-foreground': variant === 'lavender',
        },
        className
      )}
      {...props}
    />
  )
}
