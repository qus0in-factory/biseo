import type { PaneSummary } from '../domain/timeline'
import { CarouselItem } from '../components/ui/carousel'
import { PaneItem } from './PaneItem'

export function PanesCarouselItem({
  pane,
  active,
  pinned,
  onTogglePin,
  onSelect,
}: {
  pane: PaneSummary
  active: boolean
  pinned: boolean
  onTogglePin: () => void
  onSelect: () => void
}) {
  return (
    <CarouselItem key={pane.paneId}>
      <PaneItem
        item={pane}
        active={active}
        pinned={pinned}
        onTogglePin={onTogglePin}
        onClick={onSelect}
      />
    </CarouselItem>
  )
}
