import { AsyncList } from './AsyncList'
import { ListSkeleton } from './ListSkeleton'
import { UsageCard } from './UsageCard'
import { useUsage } from '../app/useUsage'
import { usageApi } from '../infra/usageApi'
import r from '../resources.json'

export function UsagePanel({ enabled = true }: { enabled?: boolean }) {
  const { stale, lastSuccessAt, state, retry } = useUsage(usageApi, enabled)
  return (
    <AsyncList
      state={state}
      skeleton={<ListSkeleton rows={2} />}
      empty={<p className="text-sm text-muted-foreground">{r.usageEmpty}</p>}
      errorText={r.usageError}
      onRetry={retry}
    >
      {(providers) => <UsageCard providers={providers} stale={stale} lastSuccessAt={lastSuccessAt} />}
    </AsyncList>
  )
}
