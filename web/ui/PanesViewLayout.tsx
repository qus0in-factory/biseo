import type { PaneSummary } from '../domain/timeline'
import { PaneSortableList } from './PaneSortableList'

type P = {
  panes: PaneSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
  register: (id: string) => (element: HTMLLIElement | null) => void
  onMove: (from: number, to: number) => void
}

export function PanesViewLayout({ panes, selectedId, onSelect, register, onMove }: P) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto">
      <PaneSortableList
        panes={panes}
        selectedId={selectedId}
        onSelect={onSelect}
        register={register}
        onMove={onMove}
      />
    </div>
  )
}
