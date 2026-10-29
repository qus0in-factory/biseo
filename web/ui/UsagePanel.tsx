import { UsagePanelRow } from './UsagePanelRow'
import { UsageHeader } from './UsageHeader'
import { useUsage } from '../app/useUsage'
import { usageApi } from '../infra/usageApi'
import { Card } from '../components/ui/card'

export function UsagePanel({ enabled = true }: { enabled?: boolean }) {
  const { providers, stale, lastSuccessAt, error } = useUsage(usageApi, enabled)
  if (error && providers.length === 0) return null
  if (providers.length === 0) return null
  return (
    <Card className="w-full rounded-md bg-surface p-3">
      <UsageHeader stale={stale} lastSuccessAt={lastSuccessAt} />
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => (
          <UsagePanelRow key={p.provider} provider={p} />
        ))}
      </div>
    </Card>
  )
}
