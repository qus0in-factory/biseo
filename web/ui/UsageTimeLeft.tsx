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
      {r.usageTimeLeft} {percent}%
    </span>
  )
}
