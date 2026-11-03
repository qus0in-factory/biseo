import { formatZoned, formatZonedShort } from '../domain/formatZoned'
import r from '../resources.json'

const TZ = 'Asia/Seoul'

export function UsageCheckedFooter({ at }: { at: string }) {
  return (
    <p className="text-right text-[11px] leading-4 tabular-nums text-muted-foreground" title={formatZoned(at, TZ)}>
      {r.usageChecked}: {formatZonedShort(at, TZ)}
    </p>
  )
}
