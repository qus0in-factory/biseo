import type { PaneSummary } from '../domain/timeline'
import { formatTime } from './timeFormat'
import r from '../resources.json'

export function BlockedReasonNotice({ target }: { target?: PaneSummary }) {
  if (!target || target.status !== 'blocked' || !target.blockedReason) return null
  const at = target.availability?.resetsAt
  const msg =
    target.blockedReason === 'usage_limited'
      ? `${r.blockedUsageLimited}${at ? ` (${r.usageReset}: ${formatTime(at)})` : ''}`
      : target.blockedReason === 'awaiting_input'
        ? r.blockedAwaitingInput
        : r.blockedSuspectedLimit
  return <p className="rounded-sm border border-border bg-surface px-2 py-1 text-xs text-muted-foreground">{msg}</p>
}
