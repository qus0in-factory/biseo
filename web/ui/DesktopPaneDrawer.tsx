import type { DashboardProps } from './dashboardTypes'
import { PaneDrawerContent } from './PaneDrawerContent'
import { PaneDrawerToggle } from './PaneDrawerToggle'
import { paneDrawerClass } from './paneDrawerClass'
import { usePaneDrawer } from './usePaneDrawer'
import r from '../resources.json'

type P = Pick<DashboardProps, 'panes' | 'panesState' | 'panesRetry' | 'selectedId' | 'onSelect'>

export function DesktopPaneDrawer({ panes, panesState, panesRetry, selectedId, onSelect }: P) {
  const { open, toggle } = usePaneDrawer()
  return (
    <aside className={paneDrawerClass(open)}>
      <div className={`flex items-center gap-2 ${open ? 'justify-between' : 'justify-center'}`}>
        {open&&<h2 className="text-base font-semibold">{r.panesTitle}</h2>}
        <PaneDrawerToggle open={open} onToggle={toggle} />
      </div>
      {open&&<PaneDrawerContent panes={panes} state={panesState} onRetry={panesRetry} selectedId={selectedId} onSelect={onSelect} />}
    </aside>
  )
}
