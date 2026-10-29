import { SheetCtx } from './sheet.context'
import type { SheetProps } from './sheet.types'

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <SheetCtx.Provider value={{ open, onOpenChange }}>
      {children}
    </SheetCtx.Provider>
  )
}

export { SheetContent } from './sheet.content'
export { SheetHeader } from './sheet.header'
export type { SheetProps, SheetContentProps } from './sheet.types'
