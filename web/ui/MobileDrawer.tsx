
import { Sheet, SheetContent } from '../components/ui/sheet'
import { useUiStore } from '../app/uiStore'
import { PaneDrawerContent } from './PaneDrawerContent'
import type { PaneSummary } from '../domain/timeline'

type P = {
  panes: PaneSummary[]
  selectedId: string | null
  onSelect: (paneId: string) => void
  online?: boolean
}

export function MobileDrawer({ panes, selectedId, onSelect, online = true }: P) {
  const { drawerOpen, setDrawerOpen } = useUiStore()
  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent title="패널">
        <PaneDrawerContent panes={panes} selectedId={selectedId} onSelect={onSelect} online={online} />
      </SheetContent>
    </Sheet>
  )
}
