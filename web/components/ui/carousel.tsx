import type { CarouselProps } from './carousel.types'
import { cn } from '../../lib/utils'

export function Carousel({ className, children, ...props }: CarouselProps) {
  return (
    <div
      role="region"
      aria-roledescription="carousel"
      className={cn('relative w-full', className)}
      {...props}
    >
      {children}
    </div>
  )
}

export { CarouselContent, CarouselItem } from './carousel.items'
export { CarouselPrevious, CarouselNext } from './carousel.buttons'
export type { CarouselProps, CarouselItemProps } from './carousel.types'
