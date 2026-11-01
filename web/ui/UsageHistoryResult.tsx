import type { UsageHistoryRatio } from '../../shared/usage-history'
import r from '../resources/usage-history.json'
import resources from '../resources.json'
import { formatZoned } from '../domain/formatZoned'

export function UsageHistoryResult({ data }: { data: UsageHistoryRatio }) {
  return <div className="space-y-3 text-sm">
    {data.ratio === null ? <p>{r.empty}</p> :
      <p>{r.ratio}: <strong>1 : {data.ratio.toFixed(3)}</strong></p>}
    <p>{r.samples}: {data.samples}</p>
    {data.from !== null && data.to !== null && <p>{r.period}:<br />
      {formatZoned(new Date(data.from).toISOString(), resources.displayTimeZone)} —
      {formatZoned(new Date(data.to).toISOString(), resources.displayTimeZone)}</p>}
    <p className="text-muted-foreground">{r.note}</p>
  </div>
}
