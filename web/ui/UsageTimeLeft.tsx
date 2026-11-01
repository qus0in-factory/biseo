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
    <span className="text-muted-foreground">
      {' · '}
      <span className="inline-flex items-center gap-1" title={title}>
        <Clock size={12} aria-label={title} role="img" />
        {percent}%
      </span>
    </span>
  )
}
