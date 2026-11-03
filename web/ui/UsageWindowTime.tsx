import type { UsageWindow } from '../domain/usage'
import { Clock } from 'lucide-react'
import { formatZoned, formatZonedShort } from '../domain/formatZoned'
import r from '../resources.json'
import { HintPopover } from './HintPopover'

const res = r as Record<string, string>
const TZ = 'Asia/Seoul'

export function UsageWindowTime({ value }: { value: UsageWindow }) {
  const reset = value.resetsAt ? formatZoned(value.resetsAt, TZ) : undefined
  return (
    <span className="flex flex-col items-end gap-0.5 text-[11px] leading-4 tabular-nums text-muted-foreground">
      <span className="inline-flex" title={reset}>
        <HintPopover label={res.usageReset!} className="gap-1">
          <Clock size={12} aria-label={res.usageReset} role="img" />
          {value.resetsAt
            ? formatZonedShort(value.resetsAt, TZ)
            : res.usageNoReset}
        </HintPopover>
      </span>
      {value.checkedAt && (
        <span title={formatZoned(value.checkedAt, TZ)}>
          {res.usageChecked}: {formatZonedShort(value.checkedAt, TZ)}
        </span>
      )}
    </span>
  )
}
