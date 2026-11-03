import { usageValueTone } from './usageValueTone'
import r from '../resources.json'

export function UsageGauge({ used, window, limited, stale = false }: {
  used: number | null; window: string; limited?: boolean; stale?: boolean
}) {
  const known = !stale && used !== null && Number.isFinite(used)
  const value = known ? Math.max(0, Math.min(100, used)) : undefined
  const tone = usageValueTone(known ? used : null, window, limited)
  const color = tone === 'danger' ? 'bg-danger' : tone === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
  return <div role="progressbar" aria-label={r.usageUsed} aria-valuemin={0} aria-valuemax={100}
    aria-valuenow={value} aria-valuetext={known ? undefined : r.usageUnconfirmed}
    className="col-span-3 h-1 min-w-0 overflow-hidden rounded-full bg-card">
    <div className={`h-full ${color}`} style={{ width: `${value ?? 0}%` }} />
  </div>
}
