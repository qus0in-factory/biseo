import type { PaneSummary } from '../domain/timeline'
import { PanesCarouselItem } from './PanesCarouselItem'

export function PanesCarouselList({
  panes,
  selectedId,
  pinned,
  onToggle,
  onSelect,
}: {
  panes: PaneSummary[]
  selectedId: string | null
  pinned: string[]
  onToggle: (id: string) => void
  onSelect: (id: string) => void
}) {
  return (
    <>
      {panes.map((p) => (
        <PanesCarouselItem
          key={p.paneId}
          pane={p}
          active={p.paneId === selectedId}
          pinned={pinned.includes(p.paneId)}
          onTogglePin={() => onToggle(p.paneId)}
          onSelect={() => onSelect(p.paneId)}
        />
      ))}
    </>
  )
}
