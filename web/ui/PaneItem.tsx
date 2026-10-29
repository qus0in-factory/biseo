import type { PaneSummary } from '../domain/timeline'
import { PaneStatusBadge } from './PaneStatusBadge'
import { ReasonDetails } from './ReasonDetails'
import r from '../resources.json'

const res = r as Record<string, string>

export function PaneItem({
  item,
  active,
  onClick,
}: {
  item: PaneSummary
  active: boolean
  onClick: () => void
}) {
  const rs = item.disabledReason ? res[item.disabledReason] ?? item.disabledReason : null

  return (
    <li>
      <button
        type="button"
        className={`pane-item ${active ? 'selected' : ''}`}
        onClick={onClick}
      >
        <strong>{item.name}</strong>
        {item.agentKind && <small>{item.agentKind}</small>}
        <PaneStatusBadge status={item.status} />
        {rs && <ReasonDetails text={`${res.reasonPrefix}${rs}`} />}
      </button>
    </li>
  )
}
