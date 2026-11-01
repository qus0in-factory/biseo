import { Clock } from 'lucide-react'
import { usageTimePercent } from '../domain/usage-time-percent'
import r from '../resources.json'

export function UsageTimeLeft({
  label,
  startsAt,
  resetsAt,
  remaining = true,
}: {
  label: string
  startsAt?: string | null
  resetsAt: string | null
  remaining?: boolean
}) {
  const percent = usageTimePercent(label, startsAt, resetsAt, remaining)
  if (percent === null) return null
  const title = remaining ? r.usageTimeLeft : r.usageTimeElapsed
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1" title={title}>
        <Clock size={12} className="shrink-0" aria-label={title} role="img" />
        <span className="text-xs leading-none">{percent}%</span>
      </span>
    </span>
  )
}
