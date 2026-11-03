import type { UsageProvider } from '../domain/usage'
import { UsageMetricRow } from './UsageMetricRow'
import { UsageWindowRow } from './UsageWindowRow'
import { selectCardMetrics } from '../domain/usage-ollama'

const SUMMARY_ROWS = 3

export function UsagePanelBody({
  provider,
  remaining = true,
  summary = false,
}: {
  provider: UsageProvider
  remaining?: boolean
  summary?: boolean
}) {
  const m = Array.isArray(provider.metrics) && provider.metrics.length > 0
  if (m) {
    const rows = selectCardMetrics(provider.provider, provider.metrics!)
    const shown = summary ? rows.slice(0, SUMMARY_ROWS) : rows
    return (
      <>
        {shown.map((x) => (
          <UsageMetricRow
            key={x.id}
            provider={provider.provider}
            metric={x}
            limitReached={provider.windows.some((w) => w.window === x.id && w.limitReached)}
            remaining={remaining}
          />
        ))}
      </>
    )
  }
  const windows = summary ? provider.windows.slice(0, SUMMARY_ROWS) : provider.windows
  return (
    <>
      {windows.map((w) => (
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
