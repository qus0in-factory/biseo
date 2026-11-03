import type { TimelineItem as I } from '../domain/timeline'
import { TurnStatusBadge } from './TurnStatusBadge'
import { CancelTurnButton } from './CancelTurnButton'
import { formatTime } from './timeFormat'
import { useTargetName } from './paneDirectory'

type P = { item: I; onCancel?: (id: string) => void }

export function AgentHeader({ item: i, onCancel }: P) {
  const isQ = i.status === 'queued'
  const t = formatTime(i.completedAt ?? i.createdAt)
  const targetName = useTargetName(i)

  return (
    <div className="mb-1.5 flex flex-wrap items-center gap-2 text-sm">
      <strong className="font-semibold text-foreground">{targetName}</strong>
      {i.agentKind && <span className="font-mono text-xs text-muted-foreground">({i.agentKind})</span>}
      <TurnStatusBadge status={i.status} errorCode={i.errorCode} />
      {isQ && onCancel && <CancelTurnButton requestId={i.requestId} onCancel={onCancel} />}
      {t && <time className="ml-auto text-xs text-muted-foreground tabular-nums">{t}</time>}
    </div>
  )
}
