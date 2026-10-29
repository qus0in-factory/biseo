import { useContext } from 'react'
import { SheetCtx } from './sheet.context'
import { SheetBackdrop } from './sheet.backdrop'
import { SheetHeader } from './sheet.header'
import type { SheetContentProps } from './sheet.types'
import { cn } from '../../lib/utils'

export function SheetContent({ children, className, title }: SheetContentProps) {
  const { open, onOpenChange } = useContext(SheetCtx)
  if (!open) return null
  const close = () => onOpenChange(false)

  return (
    <SheetBackdrop onClick={close}>
      <div
        className={cn(
          'relative z-50 flex h-full w-[280px] max-w-[85vw] flex-col bg-card p-4 shadow-xl',
          'transition-transform duration-200 motion-reduce:transition-none',
          className,
        )}
      >
        <SheetHeader title={title} onClose={close} />
        <div className="flex-1 overflow-y-auto py-2">{children}</div>
      </div>
    </SheetBackdrop>
  )
}
