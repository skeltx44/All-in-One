import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          'rounded-2xl bg-primary text-primary-foreground shadow-[0_10px_22px_rgba(61,111,232,0.22)] hover:bg-primary/90',
        app:
          'rounded-2xl bg-gradient-to-b from-[#4f86ff] to-[#2f6df0] text-white shadow-[0_12px_24px_rgba(61,111,232,0.28)] hover:brightness-[1.03]',
        soft:
          'rounded-2xl bg-[#eef6ff] text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_18px_rgba(68,106,150,0.08)] hover:bg-[#e5f1ff]',
        white:
          'rounded-2xl bg-white text-slate-800 shadow-[0_10px_22px_rgba(67,102,146,0.12)] hover:bg-slate-50',
        destructive:
          'rounded-2xl bg-destructive text-white shadow-[0_10px_22px_rgba(220,60,60,0.18)] hover:bg-destructive/90',
        outline:
          'rounded-2xl border bg-white text-slate-800 shadow-[0_8px_18px_rgba(67,102,146,0.08)] hover:bg-slate-50',
        secondary:
          'rounded-2xl bg-secondary text-secondary-foreground shadow-[0_8px_18px_rgba(67,102,146,0.08)] hover:bg-secondary/80',
        ghost:
          'rounded-2xl hover:bg-accent hover:text-accent-foreground',
        link:
          'rounded-none text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 py-2.5 has-[>svg]:px-4',
        sm: 'h-9 rounded-xl gap-1.5 px-3.5 has-[>svg]:px-3',
        lg: 'h-13 rounded-2xl px-6 text-base has-[>svg]:px-5',
        icon: 'size-11 rounded-2xl',
        'icon-sm': 'size-9 rounded-xl',
        'icon-lg': 'size-13 rounded-2xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }