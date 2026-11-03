import type { ReactNode } from 'react'
import { useContext } from 'react'
import { UsageModalDisplay } from './UsageModalDisplay'

export function UsageValueLine({
  label,
  value,
  timeLeft,
  gauge,
}: {
  label: string
  value: ReactNode
  timeLeft?: ReactNode
  gauge?: ReactNode
}) {
  const modal = useContext(UsageModalDisplay)
  if (modal) {
    return (
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_4.25rem] items-center gap-x-3 gap-y-1">
        <span className="min-w-0 truncate text-xs text-muted-foreground" title={label}>{label}</span>
        <span className="min-w-0 truncate text-right text-sm font-medium tabular-nums">{value}</span>
        {gauge && <div className="col-span-2 min-w-0">{gauge}</div>}
      </div>
    )
  }
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_4.25rem_4.75rem] items-center gap-x-3">
      <span className="min-w-0 truncate text-xs text-muted-foreground" title={label}>{label}</span>
      <span className="min-w-0 truncate text-right text-sm font-medium tabular-nums">{value}</span>
      <span className="flex min-w-0 items-center justify-end text-right text-xs tabular-nums text-muted-foreground">{timeLeft}</span>
    </div>
  )
}
