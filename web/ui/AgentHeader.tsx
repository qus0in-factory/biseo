import type { TimelineItem as I } from '../domain/timeline'
import { TurnStatusBadge } from './TurnStatusBadge'
import { CancelTurnButton } from './CancelTurnButton'
import { formatTime } from './timeFormat'

type P = { item: I; onCancel?: (id: string) => void }

export function AgentHeader({ item: i, onCancel }: P) {
  const isQ = i.status === 'queued'
  const t = formatTime(i.completedAt ?? i.createdAt)

  return (
    <div className="mb-1 flex flex-wrap items-center gap-2">
      <strong>{i.targetName}</strong>
      {i.agentKind && <small>({i.agentKind})</small>}
      <TurnStatusBadge status={i.status} errorCode={i.errorCode} />
      {isQ && onCancel && <CancelTurnButton requestId={i.requestId} onCancel={onCancel} />}
      {t && <time className="text-xs text-muted-foreground">{t}</time>}
    </div>
  )
}
