import { UsagePanelRow } from './UsagePanelRow'
import { UsageHeader } from './UsageHeader'
import { Card } from '../components/ui/card'
import type { UsageProvider } from '../domain/usage'

export function UsageCard({
  providers,
  stale,
  lastSuccessAt,
}: {
  providers: UsageProvider[]
  stale: boolean
  lastSuccessAt: string | null
}) {
  return (
    <Card className="w-full rounded-md bg-surface p-3">
      <UsageHeader stale={stale} lastSuccessAt={lastSuccessAt} />
      <div className="flex flex-wrap gap-2">
        {providers.map((p) => <UsagePanelRow key={p.provider} provider={p} />)}
      </div>
    </Card>
  )
}
