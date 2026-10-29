import type { HTMLAttributes } from 'react'
import type { CarouselItemProps } from './carousel.types'
import { cn } from '../../lib/utils'

export function CarouselContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex snap-x snap-mandatory overflow-x-auto scroll-smooth gap-3 pb-2',
        'motion-reduce:scroll-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      {...props}
    />
  )
}

export function CarouselItem({ className, ...props }: CarouselItemProps) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn('min-w-0 shrink-0 grow-0 basis-[85%] snap-center', className)}
      {...props}
    />
  )
}
