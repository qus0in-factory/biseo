import type { PaneSummary } from '../domain/timeline'
import { PanesViewLayout } from './PanesViewLayout'
import { usePaneListStore } from '../app/paneListStore'
import { selectCollapsedPanes } from '../domain/collapsedPanes'

type V = {
  panes: PaneSummary[]
  register: (paneId: string) => (el: HTMLLIElement | null) => void
  move: (from: number, to: number) => void
}

export function PanesList({
  view,
  selectedId,
  onSelect,
}: {
  view: V
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  const expanded = usePaneListStore((state) => state.expanded)
  const shown = selectCollapsedPanes(view.panes, expanded)
  const move = (from: number, to: number) => {
    const a = view.panes.findIndex((pane) => pane.paneId === shown[from]?.paneId)
    const b = view.panes.findIndex((pane) => pane.paneId === shown[to]?.paneId)
    if (a >= 0 && b >= 0) view.move(a, b)
  }
  return (
    <PanesViewLayout
      panes={shown}
      selectedId={selectedId}
      onSelect={onSelect}
      register={view.register}
      onMove={move}
    />
  )
}
