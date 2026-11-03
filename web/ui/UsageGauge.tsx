import type { UsagePaceInput } from '../domain/usagePace'
import { UsageGaugeBar } from './UsageGaugeBar'
import { useUsagePaceTick } from './useUsagePaceTick'
import { usageValueTone } from './usageValueTone'
import r from '../resources.json'

export function UsageGauge({ used, shown = used, label = r.usageUsed, window, limited, stale = false, pace }: {
  used: number | null; shown?: number | null; label?: string; window: string; limited?: boolean; stale?: boolean; pace?: UsagePaceInput | null
}) {
  const tick = useUsagePaceTick(window, pace)
  const known = !stale && shown !== null && Number.isFinite(shown)
  if (!known) return null
  const value = Math.max(0, Math.min(100, shown))
  const tone = usageValueTone(used, window, limited)
  const color = tone === 'danger' ? 'bg-danger' : tone === 'warning' ? 'bg-warning' : 'bg-muted-foreground'
  return <UsageGaugeBar value={value} color={color} label={label} tick={tick} />
}
