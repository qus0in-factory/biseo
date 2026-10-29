import { UsagePanelRow } from './UsagePanelRow'
import { UsageHeader } from './UsageHeader'
import { useUsage } from '../app/useUsage'
import { usageApi } from '../infra/usageApi'
import { usageForPane } from '../domain/usageMatch'
import { Card } from '../components/ui/card'

export function UsagePanel({ enabled = true, agentKind }: { enabled?: boolean; agentKind?: string | null }) {
  const { providers, stale, lastSuccessAt, error } = useUsage(usageApi, enabled)
  const shown = usageForPane(providers, agentKind)
  if (error && shown.length === 0) return null
  if (shown.length === 0) return null
  return (
    <Card className="w-full rounded-md bg-surface p-3">
      <UsageHeader stale={stale} lastSuccessAt={lastSuccessAt} />
      <div className="flex flex-wrap gap-2">
        {shown.map((p) => (
          <UsagePanelRow key={p.provider} provider={p} />
        ))}
      </div>
    </Card>
  )
}
