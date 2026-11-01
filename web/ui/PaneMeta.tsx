import type { PaneSummary } from '../domain/timeline'
import { BlockedReasonBadge } from './BlockedReasonBadge'
import { PaneAvailability } from './PaneAvailability'
import { PaneUsageWarning } from './PaneUsageWarning'
import { ReasonDetails } from './ReasonDetails'
import { useUsageStore } from '../app/useUsageStore'
import { getPaneReason } from './paneMetaReason'

export function PaneMeta({ item }: { item: PaneSummary }) {
  const providers = useUsageStore((s) => s.providers)
  const reason = getPaneReason(item.disabledReason)
  return (
    <>
      <small className="min-w-0 max-w-[45%] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground">
        {item.agentKind ?? ''}
      </small>
      <PaneAvailability availability={item.availability} />
      <PaneUsageWarning pane={item} providers={providers} />
      <BlockedReasonBadge item={item} />
      {reason && <ReasonDetails text={reason} />}
    </>
  )
}
