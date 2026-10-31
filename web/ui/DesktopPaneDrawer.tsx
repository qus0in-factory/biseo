import type { DashboardProps } from './dashboardTypes'
import { PaneDrawerContent } from './PaneDrawerContent'
import { PaneDrawerHeader } from './PaneDrawerHeader'
import { paneDrawerClass } from './paneDrawerClass'
import { usePaneDrawer } from './usePaneDrawer'
import { useCollapsedPaneCount } from './useCollapsedPaneCount'
import { CollapsedPanePreview } from './CollapsedPanePreview'
type P=Pick<DashboardProps,'panes'|'panesState'|'panesRetry'|'selectedId'|'onSelect'>
export function DesktopPaneDrawer({panes,panesState,panesRetry,selectedId,onSelect}:P){
 const {open,toggle}=usePaneDrawer();const c=useCollapsedPaneCount()
 return(<aside className={paneDrawerClass(open)}>
  <PaneDrawerHeader open={open} onToggle={toggle} countControl={c}/>
  {open&&<PaneDrawerContent panes={panes} state={panesState} onRetry={panesRetry} selectedId={selectedId} onSelect={onSelect}/>}
  {!open&&<CollapsedPanePreview panes={panes} count={c.count} selectedId={selectedId} onSelect={onSelect}/>}
 </aside>)
}
