import type { PaneSummary } from '../domain/timeline'
import { PaneItem } from './PaneItem'
import { SortableItem } from './sortable/SortableItem'

type P = {
  pane: PaneSummary
  selectedId: string | null
  onSelect: (id: string) => void
  register: (id: string) => (element: HTMLLIElement | null) => void
}

export function PaneSortableItem({ pane, selectedId, onSelect, register }: P) {
  return (
    <SortableItem id={pane.paneId}>
      {(sortable) => (
        <PaneItem
          ref={register(pane.paneId)}
          item={pane}
          active={pane.paneId === selectedId}
          sortable={sortable}
          onClick={() => onSelect(pane.paneId)}
        />
      )}
    </SortableItem>
  )
}
