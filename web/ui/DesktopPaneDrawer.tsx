import type { DashboardProps } from './dashboardTypes'
import { PaneDrawerContent } from './PaneDrawerContent'
import { PaneDrawerToggle } from './PaneDrawerToggle'
import { paneDrawerClass } from './paneDrawerClass'
import { usePaneDrawer } from './usePaneDrawer'
import r from '../resources.json'

type P = Pick<DashboardProps, 'panes' | 'selectedId' | 'onSelect' | 'online'>

export function DesktopPaneDrawer({ panes, selectedId, onSelect, online }: P) {
  const { open, toggle } = usePaneDrawer()
  return (
    <aside className={paneDrawerClass(open)}>
      <div className={`flex items-center gap-2 ${open ? 'justify-between' : 'justify-center'}`}>
        {open&&<h2 className="text-base font-semibold">{r.panesTitle}</h2>}
        <PaneDrawerToggle open={open} onToggle={toggle} />
      </div>
      {open&&<PaneDrawerContent panes={panes} selectedId={selectedId} onSelect={onSelect} online={online} />}
    </aside>
  )
}
