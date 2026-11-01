import { useQuery } from '@tanstack/react-query'
import { getUsageHistory } from '../infra/usageHistoryApi'
import { ListSkeleton } from './ListSkeleton'
import { UsageHistoryResult } from './UsageHistoryResult'
import r from '../resources/usage-history.json'
import { Button } from '../components/ui/button'

export function UsageHistoryBody({ provider }: { provider: string }) {
  const query = useQuery({ queryKey: ['usage-history', provider],
    queryFn: () => getUsageHistory(provider), retry: false })
  if (query.isPending) return <div role="status" aria-label={r.loading}>
    <ListSkeleton rows={2} />{r.loading}</div>
  if (query.isError) return <div role="alert">{r.error}
    <Button variant="ghost" onClick={() => void query.refetch()}>{r.retry}</Button></div>
  return <UsageHistoryResult data={query.data} />
}
