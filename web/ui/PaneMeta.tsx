import type { PaneSummary } from '../domain/timeline'
import { BlockedReasonBadge } from './BlockedReasonBadge'
import { PaneAvailability } from './PaneAvailability'
import { PaneUsageWarning } from './PaneUsageWarning'
import { ReasonDetails } from './ReasonDetails'
import { ModelIcon } from './ModelIcon'
import { modelFamily } from '../domain/modelFamily'
import { useUsageStore } from '../app/useUsageStore'
import { getPaneReason } from './paneMetaReason'
import r from '../resources.json'

export function PaneMeta({ item }: { item: PaneSummary }) {
  const providers = useUsageStore((s) => s.providers)
  const reason = getPaneReason(item.disabledReason)
  const family = modelFamily(item.modelId, item.modelProvider)
  const model = item.modelId?.trim() || r.modelUnknown
  return (
    <>
      <ModelIcon family={family} />
      <small
        className="min-w-0 max-w-[45%] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground"
        title={item.modelId ?? undefined}
      >
        {model}
      </small>
      <PaneAvailability availability={item.availability} />
      <PaneUsageWarning pane={item} providers={providers} />
      <BlockedReasonBadge item={item} />
      {reason && <ReasonDetails text={reason} />}
    </>
  )
}
