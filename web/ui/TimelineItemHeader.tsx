import type { TimelineItem } from '../domain/timeline'
import { TurnStatusBadge } from './TurnStatusBadge'
import { CancelTurnButton } from './CancelTurnButton'
import { useTargetName } from './paneDirectory'
import r from '../resources.json'

export function TimelineItemHeader({
  item,
  onCancel,
}: {
  item: TimelineItem
  onCancel?: (id: string) => void
}) {
  const isQueued = item.status === 'queued'
  const targetName = useTargetName(item)
  return (
    <div className="flex flex-wrap items-center gap-2">
      <strong>{targetName}</strong>{' '}
      <TurnStatusBadge status={item.status} />
      {isQueued && onCancel && (
        <CancelTurnButton requestId={item.requestId} title={`${r.cancel} (${item.requestId})`} onCancel={onCancel} />
      )}
      {item.cancelError && <span className="text-error">({item.cancelError})</span>}
    </div>
  )
}
