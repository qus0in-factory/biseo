import { Clock } from 'lucide-react'
import { usageRemainingTimePercent } from '../domain/usage-remaining-time'
import r from '../resources.json'

export function UsageTimeLeft({
  label,
  startsAt,
  resetsAt,
}: {
  label: string
  startsAt?: string | null
  resetsAt: string | null
}) {
  const percent = usageRemainingTimePercent(label, startsAt, resetsAt)
  if (percent === null) return null
  return (
    <span className="text-muted-foreground">
      {' · '}
      <span className="inline-flex items-center gap-1" title={r.usageTimeLeft}>
        <Clock size={12} aria-label={r.usageTimeLeft} role="img" />
        {percent}%
      </span>
    </span>
  )
}
