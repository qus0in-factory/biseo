import { UsagePanelRow } from './UsagePanelRow'
import { UsageHeader } from './UsageHeader'
import { useUsage } from '../app/useUsage'
import { usageApi } from '../infra/usageApi'
import { Card } from '../components/ui/card'
import r from '../resources.json'

export function UsagePanel({ enabled = true }: { enabled?: boolean }) {
  const { providers, stale, lastSuccessAt, error } = useUsage(usageApi, enabled)
  if (error && providers.length === 0) return <p className="text-sm text-error">{r.usageError}</p>
  if (providers.length === 0) return <p className="text-sm text-muted-foreground">{r.usageEmpty}</p>
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
