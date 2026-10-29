import type { ButtonHTMLAttributes } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../lib/utils'

const btnCls =
  'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-card border border-border shadow-xs hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35'

export function CarouselPrevious({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-label="이전 패널" className={cn(btnCls, className)} {...props}>
      <ChevronLeft size={18} aria-hidden="true" />
    </button>
  )
}

export function CarouselNext({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" aria-label="다음 패널" className={cn(btnCls, className)} {...props}>
      <ChevronRight size={18} aria-hidden="true" />
    </button>
  )
}
