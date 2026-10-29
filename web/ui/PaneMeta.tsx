import type { PaneSummary } from '../domain/timeline'
import { BlockedReasonBadge } from './BlockedReasonBadge'
import { PaneAvailability } from './PaneAvailability'
import { ReasonDetails } from './ReasonDetails'
import r from '../resources.json'

const res = r as Record<string, string>

export function PaneMeta({ item }: { item: PaneSummary }) {
  const d = item.disabledReason
  const reason = d ? `${res.reasonPrefix}${res[d] ?? d}` : null
  return (
    <>
      <small className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">{item.agentKind ?? ''}</small>
      <PaneAvailability availability={item.availability} />
      <BlockedReasonBadge item={item} />
      {reason && <ReasonDetails text={reason} />}
    </>
  )
}
