import type { TimelineItem } from '../domain/timeline'
import { TurnStatusBadge } from './TurnStatusBadge'
import { CancelTurnButton } from './CancelTurnButton'
import { formatTime } from './timeFormat'
import { useTargetName } from './paneDirectory'
import r from '../resources.json'

type P = { item: TimelineItem; onCancel?: (id: string) => void }

export function TimelineItemHeader({ item: i, onCancel }: P) {
  const isQ = i.status === 'queued'
  const name = useTargetName(i)
  const t = formatTime(i.completedAt ?? i.createdAt)
  return (
    <div className="mb-1.5 flex flex-wrap items-center gap-2 text-sm">
      <strong className="font-semibold text-foreground">{name}</strong>
      {i.agentKind && <span className="font-mono text-xs text-muted-foreground">({i.agentKind})</span>}
      <TurnStatusBadge status={i.status} errorCode={i.errorCode} />
      {isQ && onCancel && (
        <CancelTurnButton requestId={i.requestId} title={`${r.cancel} (${i.requestId})`} onCancel={onCancel} />
      )}
      {t && <time className="ml-auto text-xs text-muted-foreground tabular-nums">{t}</time>}
      {i.cancelError && <span className="text-error">({i.cancelError})</span>}
    </div>
  )
}
