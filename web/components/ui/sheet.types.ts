import type { ReactNode } from 'react'

export interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: ReactNode
}

export interface SheetContentProps {
  children: ReactNode
  className?: string
  title?: string
}
