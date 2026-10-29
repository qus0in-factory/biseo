import type { UsageWindow } from '../domain/usage'
import { formatZoned } from '../domain/formatZoned'
import r from '../resources.json'

const res = r as Record<string, string>
const TZ = 'Asia/Seoul'

export function UsageWindowTime({ value }: { value: UsageWindow }) {
  return (
    <>
      <span className="text-xs text-muted-foreground">
        {res.usageReset}: {value.resetsAt ? formatZoned(value.resetsAt, TZ) : res.usageNoReset}
      </span>
      {value.checkedAt && (
        <span className="text-xs text-muted-foreground">
          {res.usageChecked}: {formatZoned(value.checkedAt, TZ)}
        </span>
      )}
    </>
  )
}
