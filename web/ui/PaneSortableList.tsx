import type { PaneSummary } from '../domain/timeline'
import { PaneSortableItem } from './PaneSortableItem'
import { SortableList } from './sortable/SortableList'

type P = {
  panes: PaneSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
  register: (id: string) => (element: HTMLLIElement | null) => void
  onMove: (from: number, to: number) => void
}

export function PaneSortableList({ panes, selectedId, onSelect, register, onMove }: P) {
  return (
    <SortableList ids={panes.map((p) => p.paneId)} onReorder={onMove}>
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {panes.map((pane) => (
          <PaneSortableItem
            key={pane.paneId}
            pane={pane}
            selectedId={selectedId}
            onSelect={onSelect}
            register={register}
          />
        ))}
      </ul>
    </SortableList>
  )
}
