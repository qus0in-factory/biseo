import type { UsageWindow } from '../domain/usage'
import { Clock } from 'lucide-react'
import { formatZonedShort } from '../domain/formatZoned'
import r from '../resources.json'

const res = r as Record<string, string>
const TZ = 'Asia/Seoul'

export function UsageWindowTime({ value }: { value: UsageWindow }) {
  return (
    <>
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground" title={res.usageReset}>
        <Clock size={12} aria-label={res.usageReset} role="img" />
        {value.resetsAt
          ? `${formatZonedShort(value.resetsAt, TZ)} (${res.displayTimeZoneLabel})`
          : res.usageNoReset}
      </span>
      {value.checkedAt && (
        <span className="text-xs text-muted-foreground">
          {res.usageChecked}: {formatZonedShort(value.checkedAt, TZ)}
        </span>
      )}
    </>
  )
}
