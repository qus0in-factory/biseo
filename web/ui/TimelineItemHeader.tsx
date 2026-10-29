import { X } from 'lucide-react'
import type { TimelineItem } from '../domain/timeline'
import { TurnStatusBadge } from './TurnStatusBadge'
import r from '../resources.json'

export function TimelineItemHeader({
  item,
  onCancel,
}: {
  item: TimelineItem
  onCancel?: (id: string) => void
}) {
  const isQueued = item.status === 'queued'
  return (
    <div className="timeline-header">
      <strong>{item.targetName}</strong> <small>({item.paneId})</small>{' '}
      <TurnStatusBadge status={item.status} />
      {isQueued && onCancel && (
        <button
          type="button"
          className="icon-btn btn-cancel"
          onClick={() => onCancel(item.requestId)}
          aria-label={`${r.cancel} ${item.requestId}`}
          title={`${r.cancel} (${item.requestId})`}
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
      {item.cancelError && <span className="err">({item.cancelError})</span>}
    </div>
  )
}
