import { formatZoned } from '../domain/formatZoned'
import r from '../resources.json'

const res = r as Record<string, string>
const TZ = 'Asia/Seoul'

export function UsageHeader({ stale, lastSuccessAt }: { stale: boolean; lastSuccessAt: string | null }) {
  return (
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
      <h2 className="text-sm font-semibold">{res.usageTitle}</h2>
      {stale && (
        <span className="text-xs text-muted-foreground">
          {res.usageStale}
          {lastSuccessAt ? ` · ${res.usageLastSuccess} ${formatZoned(lastSuccessAt, TZ)}` : ''}
        </span>
      )}
    </div>
  )
}
