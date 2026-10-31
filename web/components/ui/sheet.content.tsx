import { useCallback, useContext } from 'react'
import { SheetCtx } from './sheet.context'
import { SheetBackdrop } from './sheet.backdrop'
import { SheetHeader } from './sheet.header'
import { useSheetA11y } from './useSheetA11y'
import type { SheetContentProps as Props } from './sheet.types'
import { cn } from '../../lib/utils'

import { sheetPanelClass } from './sheet.styles'

export function SheetContent({ children, className, title, headerActions }: Props) {
  const { open, onOpenChange } = useContext(SheetCtx)
  const close = useCallback(() => onOpenChange(false), [onOpenChange])
  const ref = useSheetA11y(open, close)
  if (!open) return null

  return (
    <SheetBackdrop onClick={close}>
      <div ref={ref} className={cn(sheetPanelClass, className)}>
        <SheetHeader title={title} onClose={close} actions={headerActions}/>
        <div className="flex-1 overflow-y-auto py-2">{children}</div>
      </div>
    </SheetBackdrop>
  )
}
