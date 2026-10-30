import type { UsageProvider } from '../domain/usage'
import { UsageMetricRow } from './UsageMetricRow'
import { UsageWindowRow } from './UsageWindowRow'

export function UsagePanelBody({
  provider,
  remaining = true,
}: {
  provider: UsageProvider
  remaining?: boolean
}) {
  const m = Array.isArray(provider.metrics) && provider.metrics.length > 0
  if (m) {
    return (
      <>
        {provider.metrics!.map((x) => (
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
