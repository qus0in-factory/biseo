import { X } from 'lucide-react'
import type { TimelineItem as I } from '../domain/timeline'
import { TurnStatusBadge } from './TurnStatusBadge'
import { formatTime } from './timeFormat'
import r from '../resources.json'

type P = { item: I; onCancel?: (id: string) => void }

export function AgentHeader({ item: i, onCancel }: P) {
  const isQ = i.status === 'queued'
  const t = formatTime(i.completedAt ?? i.createdAt)
  const btn = isQ && onCancel && (
    <button
      type="button"
      className="icon-btn btn-cancel"
      onClick={() => onCancel(i.requestId)}
      aria-label={`${r.cancel} ${i.requestId}`}
      title={r.cancel}
    >
      <X size={14} aria-hidden="true" />
    </button>
  )

  return (
    <div className="chat-agent-header">
      <strong>{i.targetName}</strong>
      {i.agentKind && <small>({i.agentKind})</small>}
      <TurnStatusBadge status={i.status} />
      {btn}
      {t && <time className="chat-time">{t}</time>}
    </div>
  )
}
