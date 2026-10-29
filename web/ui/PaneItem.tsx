import type { PaneSummary } from '../domain/timeline'
import { PaneStatusBadge } from './PaneStatusBadge'
import { ReasonDetails } from './ReasonDetails'
import r from '../resources.json'

const res = r as Record<string, string>
type P = { item: PaneSummary; active: boolean; onClick: () => void }

export function PaneItem({ item, active, onClick }: P) {
  const d = item.disabledReason
  const reason = d ? `${res.reasonPrefix}${res[d] ?? d}` : null

  return (
    <li>
      <button type="button" className={`pane-item ${active ? 'selected' : ''}`} onClick={onClick}>
        <span className="pane-item-row pane-item-primary">
          <strong className="pane-name">{item.name}</strong>
          <PaneStatusBadge status={item.status} />
        </span>
        <span className="pane-item-row pane-item-secondary">
          <small className="pane-agent-kind">{item.agentKind ?? ''}</small>
          {reason && <ReasonDetails text={reason} />}
        </span>
      </button>
    </li>
  )
}
