import type { DashboardProps } from './dashboardTypes'
import { Carousel, CarouselContent } from '../components/ui/carousel'
import { PanesCarouselList } from './PanesCarouselList'
import { usePanesView } from './usePanesView'
import r from '../resources.json'

type P = Pick<DashboardProps, 'panes' | 'selectedId' | 'onSelect'>

export function PanesCarouselView({ panes, selectedId, onSelect }: P) {
  const v = usePanesView({ panes, selectedId })
  if (!panes.length || !v) return <p className="text-sm text-muted-foreground py-4">{r.emptyPanes}</p>
  const list = [...v.pinnedPanes, ...v.rest]

  return (
    <Carousel className="w-full">
      <CarouselContent>
        <PanesCarouselList
          panes={list}
          selectedId={selectedId}
          pinned={v.pinned}
          onToggle={v.toggle}
          onSelect={onSelect}
        />
      </CarouselContent>
    </Carousel>
  )
}
