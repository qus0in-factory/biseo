import { useContext } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import { TabsCtx } from './tabs.context'
import { cn } from '../../lib/utils'

export function TabsTrigger({
  value,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const { value: active, onValueChange } = useContext(TabsCtx)
  const sel = active === value
  return (
    <button
      role="tab"
      type="button"
      aria-selected={sel}
      onClick={() => onValueChange?.(value)}
      className={cn(
        'inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium',
        'transition-colors duration-150 motion-reduce:transition-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        sel ? 'bg-card text-foreground font-semibold shadow-xs' : 'hover:text-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
