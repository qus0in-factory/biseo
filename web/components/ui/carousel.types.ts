import type { HTMLAttributes, ReactNode } from 'react'

export interface CarouselProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export interface CarouselItemProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}
