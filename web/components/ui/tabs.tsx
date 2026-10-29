import type { HTMLAttributes, ReactNode } from 'react'
import { TabsCtx } from './tabs.context'
import { cn } from '../../lib/utils'

export function Tabs({
  value,
  onValueChange,
  className,
  children,
}: {
  value?: string
  onValueChange?: (v: string) => void
  className?: string
  children: ReactNode
}) {
  return (
    <TabsCtx.Provider value={{ value, onValueChange }}>
      <div className={cn('flex flex-col', className)}>{children}</div>
    </TabsCtx.Provider>
  )
}

export function TabsList({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="tablist"
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground',
        className,
      )}
      {...props}
    />
  )
}

export { TabsTrigger } from './tabs.trigger'
export { TabsContent } from './tabs.content'
