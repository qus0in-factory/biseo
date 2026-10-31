import { PaneDrawerToggle } from './PaneDrawerToggle'
import { CollapsedPaneCountControl } from './CollapsedPaneCountControl'
import type { useCollapsedPaneCount } from './useCollapsedPaneCount'
import r from '../resources.json'
type Props = {
 open: boolean
 onToggle: () => void
 countControl: ReturnType<typeof useCollapsedPaneCount>
}
export function PaneDrawerHeader({open,onToggle,countControl:c}:Props){
 return <div className={`flex items-center gap-2 ${open?'justify-between':'justify-center'}`}>
  {open&&<h2 className="text-base font-semibold">{r.panesTitle}</h2>}
  <PaneDrawerToggle open={open} onToggle={onToggle}/>
  <CollapsedPaneCountControl count={c.count} onDecrease={c.decrease} onIncrease={c.increase} canDecrease={c.canDecrease} canIncrease={c.canIncrease}/>
 </div>
}
