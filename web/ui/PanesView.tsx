import type { PaneSummary } from '../domain/timeline'
import { PaneItem } from './PaneItem'
import r from '../resources.json'

type Props = {
  panes: PaneSummary[]
  selectedId: string | null
  onSelect: (paneId: string) => void
}

export function PanesView({ panes, selectedId, onSelect }: Props) {
  if (panes.length === 0) return <p className="spinner">{r.emptyPanes}</p>
  return (
    <ul className="pane-list">
      {panes.map((p) => (
        <PaneItem
          key={p.paneId}
          item={p}
          active={p.paneId === selectedId}
          onClick={() => onSelect(p.paneId)}
        />
      ))}
    </ul>
  )
}
