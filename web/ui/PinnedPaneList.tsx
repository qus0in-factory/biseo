import type { PaneSummary } from '../domain/timeline'
import { PaneItem } from './PaneItem'

type P = {
  panes: PaneSummary[]
  selectedId: string | null
  onToggle: (paneId: string) => void
  onSelect: (paneId: string) => void
  register: (paneId: string) => (element: HTMLLIElement | null) => void
}

export function PinnedPaneList({ panes, selectedId, onToggle, onSelect, register }: P) {
  return (
    <ul className="m-0 flex shrink-0 list-none flex-col gap-2 p-0">
      {panes.map((pane) => (
        <PaneItem
          key={pane.paneId}
          ref={register(pane.paneId)}
          item={pane}
          active={pane.paneId === selectedId}
          pinned
          onTogglePin={() => onToggle(pane.paneId)}
          onClick={() => onSelect(pane.paneId)}
        />
      ))}
    </ul>
  )
}
