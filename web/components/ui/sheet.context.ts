import { createContext } from 'react'

export interface SheetCtxValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const SheetCtx = createContext<SheetCtxValue>({
  open: false,
  onOpenChange: () => {},
})
