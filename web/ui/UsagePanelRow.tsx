import type { UsageProvider } from '../domain/usage'
import { UsageMetricRow } from './UsageMetricRow'
import { UsageWindowRow } from './UsageWindowRow'
import r from '../resources.json'

const res = r as Record<string, string>

export function UsagePanelRow({ provider, remaining = true }: { provider: UsageProvider; remaining?: boolean }) {
  const state = res[`usage_${provider.state}`] ?? provider.state
  const hasMetrics = Array.isArray(provider.metrics) && provider.metrics.length > 0
  return (
    <div className="flex min-w-48 flex-col gap-1 rounded-md border border-border px-3 py-2 text-sm">
      <div className="flex items-center justify-between gap-3">
        <span className="font-medium">{provider.provider}</span>
        <span className={provider.state === 'limited' ? 'text-error' : 'text-muted-foreground'}>{state}</span>
      </div>
      {hasMetrics
        ? provider.metrics!.map((m) => <UsageMetricRow key={m.id} metric={m} remaining={remaining} />)
        : provider.windows.map((w) => <UsageWindowRow key={w.window} value={w} remaining={remaining} />)}
    </div>
  )
}
