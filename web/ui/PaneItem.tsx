import type { PaneSummary } from '../domain/timeline'
import { PaneMeta } from './PaneMeta'
import { PaneStatusBadge } from './PaneStatusBadge'

type P = { item: PaneSummary; active: boolean; onClick: () => void }

export function PaneItem({ item, active, onClick }: P) {
  return (
    <li>
      <button type="button" className={`pane-item ${active ? 'selected' : ''}`} onClick={onClick}>
        <span className="pane-item-row pane-item-primary">
          <strong className="pane-name">{item.name}</strong>
          <PaneStatusBadge status={item.status} />
        </span>
        <span className="pane-item-row pane-item-secondary">
          <PaneMeta item={item} />
        </span>
      </button>
    </li>
  )
}
