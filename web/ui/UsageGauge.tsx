import { usageValueTone } from './usageValueTone'
import r from '../resources.json'

export function UsageGauge({ used, shown = used, label = r.usageUsed, window, limited, stale = false }: {
  used: number | null; shown?: number | null; label?: string; window: string; limited?: boolean; stale?: boolean
}) {
  const known = !stale && shown !== null && Number.isFinite(shown)
  if (!known) return null
  const value = Math.max(0, Math.min(100, shown))
  const tone = usageValueTone(used, window, limited)
  const color = tone === 'danger' ? 'bg-danger' : tone === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
  return <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100}
    aria-valuenow={value}
    className="h-1.5 w-full min-w-0 overflow-hidden rounded-full bg-muted">
    <div className={`h-full ${color}`} style={{ width: `${value}%` }} />
  </div>
}
