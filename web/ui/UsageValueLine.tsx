import type { ReactNode } from 'react'

export function UsageValueLine({
  label,
  value,
  timeLeft,
}: {
  label: string
  value: string
  timeLeft?: ReactNode
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="min-w-0 flex-1 truncate text-xs text-muted-foreground" title={label}>{label}</span>
      <span className="flex shrink-0 items-baseline gap-1 font-mono text-xs">
        <span className="min-w-16 whitespace-nowrap text-right">{value}</span>
        <span className="w-16 shrink-0 whitespace-nowrap text-right">{timeLeft}</span>
      </span>
    </div>
  )
}
