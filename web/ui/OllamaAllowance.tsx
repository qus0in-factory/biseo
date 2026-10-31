import type { UsageMetric } from '../domain/usage'
import r from '../resources.json'

export function OllamaAllowance({ provider, metric }: { provider: string, metric: UsageMetric }) {
  if (provider !== 'ollama' || metric.id !== 'included_balance' || metric.limit === null) return null
  return <span className="text-xs text-muted-foreground">{r.usageAllowance}: ${metric.limit}</span>
}
