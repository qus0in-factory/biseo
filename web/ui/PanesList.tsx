import type { PaneSummary } from '../domain/timeline'
import { PanesViewLayout } from './PanesViewLayout'

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
  return (
    <PanesViewLayout
      a={view.pinnedPanes}
      b={view.rest}
      s={selectedId}
      p={view.pinned}
      t={view.toggle}
      c={onSelect}
      r={view.register}
    />
  )
}
