import type { RecentPull } from './useRecentPull'
import { LoadingState } from './LoadingState'
import resources from '../resources.json'

export function RecentPullStatus({ pull }: { pull: RecentPull }) {
  if (pull.isPending) return <div className="pb-1"><LoadingState variant="inline" label={resources.recentLoading} /></div>
  if (pull.isError) return <p role="alert" className="pb-1 text-sm">{resources.recentError}</p>
  if (pull.isSuccess) return <p role="status" className="pb-1 text-sm">{resources[`recent_${pull.data.state}`]}</p>
  return null
}
