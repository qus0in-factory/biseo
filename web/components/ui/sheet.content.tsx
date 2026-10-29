import { useCallback, useContext } from 'react'
import { SheetCtx } from './sheet.context'
import { SheetBackdrop } from './sheet.backdrop'
import { SheetHeader } from './sheet.header'
import { useSheetA11y } from './useSheetA11y'
import type { SheetContentProps as Props } from './sheet.types'
import { cn } from '../../lib/utils'

const BASE =
  'relative z-50 flex h-full w-[280px] max-w-[85vw] flex-col bg-card p-4 shadow-xl transition-transform duration-200 motion-reduce:transition-none'

export function SheetContent({ children, className, title }: Props) {
  const { open, onOpenChange } = useContext(SheetCtx)
  const close = useCallback(() => onOpenChange(false), [onOpenChange])
  const ref = useSheetA11y(open, close)
  if (!open) return null

  return (
    <SheetBackdrop onClick={close}>
      <div ref={ref} className={cn(BASE, className)}>
        <SheetHeader title={title} onClose={close} />
        <div className="flex-1 overflow-y-auto py-2">{children}</div>
      </div>
    </SheetBackdrop>
  )
}
