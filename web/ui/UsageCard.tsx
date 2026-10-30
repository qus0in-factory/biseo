import { UsagePanelRow } from './UsagePanelRow'
import { UsageCacheNote } from './UsageCacheNote'
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
        {providers.map((p) => <div key={p.provider} className="flex flex-col gap-1"><UsageCacheNote provider={p} /><UsagePanelRow provider={p} /></div>)}
      </div>
    </Card>
  )
}
