import { useContext } from 'react'
import type { HTMLAttributes } from 'react'
import { TabsCtx } from './tabs.context'
import { cn } from '../../lib/utils'

export function TabsContent({
  value,
  className,
  children,
}: HTMLAttributes<HTMLDivElement> & { value: string }) {
  const { value: active } = useContext(TabsCtx)
  if (active !== value) return null
  return (
    <div
      role="tabpanel"
      tabIndex={0}
      className={cn('mt-2 focus-visible:outline-none', className)}
    >
      {children}
    </div>
  )
}
