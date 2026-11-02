import { Download } from 'lucide-react'
import { useRecentPull } from './useRecentPull'
import { LoadingState } from './LoadingState'
import { Button } from '../components/ui/button'
import resources from '../resources.json'

export function RecentPullButton({ pane, onImported }: { pane: string; onImported?: () => void }) {
  const pull = useRecentPull(pane, onImported)
  return (
    <div className="mb-2 flex flex-col items-start gap-4 text-sm [&>p]:mt-0">
      <Button variant="outline" disabled={pull.isPending} onClick={() => pull.mutate()}>
        <Download size={16} aria-hidden="true" />
        {resources.recentPull}
      </Button>
      {pull.isPending ? <LoadingState variant="inline" label={resources.recentLoading} />
        : pull.isError ? <p role="alert">{resources.recentError}</p>
        : pull.isSuccess ? <p role="status">{resources[`recent_${pull.data.state}`]}</p> : null}
    </div>
  )
}
