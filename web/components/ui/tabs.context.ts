import { createContext } from 'react'

export type TabsCtxValue = {
  value?: string
  onValueChange?: (v: string) => void
}

export const TabsCtx = createContext<TabsCtxValue>({})
