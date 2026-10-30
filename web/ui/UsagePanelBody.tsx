import type { UsageProvider } from '../domain/usage'
import { UsageMetricRow } from './UsageMetricRow'
import { UsageWindowRow } from './UsageWindowRow'
import { selectCardMetrics } from '../domain/usage-ollama'

export function UsagePanelBody({
  provider,
  remaining = true,
}: {
  provider: UsageProvider
  remaining?: boolean
}) {
  const m = Array.isArray(provider.metrics) && provider.metrics.length > 0
  if (m) {
    const rows = selectCardMetrics(provider.provider, provider.metrics!)
    return (
      <>
        {rows.map((x) => (
          <UsageMetricRow
            key={x.id}
            provider={provider.provider}
            metric={x}
            remaining={remaining}
          />
        ))}
      </>
    )
  }
  return (
    <>
      {provider.windows.map((w) => (
        <UsageWindowRow
          key={w.window}
          provider={provider.provider}
          value={w}
          remaining={remaining}
        />
      ))}
    </>
  )
}
