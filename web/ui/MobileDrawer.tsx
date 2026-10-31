
import { Sheet, SheetContent } from '../components/ui/sheet'
import { useUiStore } from '../app/uiStore'
import { PaneDrawerContent } from './PaneDrawerContent'
import type { PaneSummary } from '../domain/timeline'
import type { AsyncState } from '../domain/asyncState'
import { PaneListToggle } from './PaneListToggle'
import r from '../resources.json'

type P = {
  panes: PaneSummary[]
  panesState?: AsyncState<PaneSummary[]>
  panesRetry?: () => void
  selectedId: string | null
  onSelect: (paneId: string) => void
}

export function MobileDrawer({ panes, panesState, panesRetry, selectedId, onSelect }: P) {
  const { drawerOpen, setDrawerOpen } = useUiStore()
  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent title={r.panesTitle}>
        <PaneListToggle />
        <PaneDrawerContent panes={panes} state={panesState} onRetry={panesRetry} selectedId={selectedId} onSelect={onSelect} />
      </SheetContent>
    </Sheet>
  )
}
