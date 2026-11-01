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
      <span className="flex shrink-0 items-center gap-1 font-mono text-xs leading-none">
        <span className="min-w-16 whitespace-nowrap text-right text-xs leading-none">{value}</span>
        <span className="flex w-16 shrink-0 items-center justify-end whitespace-nowrap text-right text-xs leading-none">{timeLeft}</span>
      </span>
    </div>
  )
}
