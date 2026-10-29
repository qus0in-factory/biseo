import type { PaneSummary } from '../domain/timeline'
import { Carousel, CarouselContent, CarouselItem } from '../components/ui/carousel'
import { PaneItem } from './PaneItem'
import r from '../resources.json'

export function PanesCarouselView({
  panes,
  selectedId,
  onSelect,
}: {
  panes: PaneSummary[]
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (panes.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">{r.emptyPanes}</p>
  }

  return (
    <Carousel className="w-full">
      <CarouselContent>
        {panes.map((p) => (
          <CarouselItem key={p.paneId}>
            <PaneItem
              item={p}
              active={p.paneId === selectedId}
              onClick={() => onSelect(p.paneId)}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
