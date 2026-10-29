import type { DashboardProps } from './dashboardTypes'
import { TabsContent } from '../components/ui/tabs'
import { PanesCarouselView } from './PanesCarouselView'
import { TimelineSection } from './TimelineSection'

export function MobileTabsContent(p: DashboardProps) {
  const target = p.panes.find((x) => x.paneId === p.selectedId)
  return (
    <>
      <TabsContent value="panels">
        <PanesCarouselView panes={p.panes} selectedId={p.selectedId} onSelect={p.onSelect} />
      </TabsContent>
      <TabsContent value="chat">
        <TimelineSection target={target} timeline={p.timeline} sending={p.sending} onSend={p.onSend} onCancel={p.onCancel} />
      </TabsContent>
    </>
  )
}
