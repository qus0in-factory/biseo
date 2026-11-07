import { RefreshCw } from 'lucide-react'
import { Button } from '../components/ui/button'
import { useUsageRefresh } from '../app/useUsageRefresh'
import r from '../resources.json'

export function UsageRefreshButton({ retry, loading }: {
  retry: () => Promise<void>; loading: boolean
}) {
  const { busy, pending, refresh } = useUsageRefresh(retry)
  return <Button type="button" variant="outline" className="min-h-11 px-2 sm:px-3"
    disabled={loading || busy} aria-busy={loading || pending} onClick={() => void refresh()}>
    <RefreshCw size={16} aria-hidden="true" className={loading || pending ? 'animate-spin' : ''} />
    <span className="text-xs sm:text-sm">{r.usageRefresh}</span>
  </Button>
}
