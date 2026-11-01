import type { PaneSummary } from '../domain/timeline'
import { PanesViewLayout } from './PanesViewLayout'
import { usePaneListStore } from '../app/paneListStore'
import { selectCollapsedPanes } from '../domain/collapsedPanes'

type V = {
  pinnedPanes: PaneSummary[]
  rest: PaneSummary[]
  pinned: string[]
  toggle: (paneId: string) => void
  register: (paneId: string) => (el: HTMLLIElement | null) => void
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
  const expanded = usePaneListStore(state => state.expanded)
  const shown = selectCollapsedPanes([...view.pinnedPanes, ...view.rest], expanded)
  return (
    <PanesViewLayout
      a={shown.slice(0, view.pinnedPanes.length)}
      b={shown.slice(view.pinnedPanes.length)}
      s={selectedId}
      p={view.pinned}
      t={view.toggle}
      c={onSelect}
      r={view.register}
    />
  )
}
