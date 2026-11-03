import type { ReactNode } from 'react'
import { useContext } from 'react'
import { UsageModalDisplay } from './UsageModalDisplay'

const shortLabel = (label: string): boolean => label.trim().length <= 2

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
  const title = shortLabel(label) ? undefined : label
  const cells = (
    <>
      <span className="min-w-0 truncate text-sm text-muted-foreground" title={title}>{label}</span>
      <span className="min-w-0 truncate text-right text-base font-medium tabular-nums">{value}</span>
    </>
  )
  if (modal) {
    return (
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_7.25rem] items-center gap-x-3 gap-y-1">
        {cells}
        {gauge && <div className="col-span-2 min-w-0">{gauge}</div>}
      </div>
    )
  }
  return (
    <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_4.25rem_4.75rem] items-center gap-x-3">
      {cells}
      <span className="flex min-w-0 items-center justify-end text-right text-sm tabular-nums text-muted-foreground">{timeLeft}</span>
    </div>
  )
}
