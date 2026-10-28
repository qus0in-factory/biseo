import type { PaneSummary } from '../domain/timeline'
import r from '../resources.json'

type P = Record<string, string>
const res = r as P

export function PaneItem({
  item,
  active,
  onClick,
}: {
  item: PaneSummary
  active: boolean
  onClick: () => void
}) {
  const st = res[`status_${item.status}`] ?? item.status
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
        <span className="pane-badge">{st}</span>
        {rs && <small className="err">{res.reasonPrefix}{rs}</small>}
      </button>
    </li>
  )
}
