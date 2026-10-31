import { PaneDrawerToggle } from './PaneDrawerToggle'
import { PaneListToggle } from './PaneListToggle'
import r from '../resources.json'
type Props = {
 open: boolean
 onToggle: () => void
}
export function PaneDrawerHeader({open,onToggle}:Props){
 return <div className={`flex flex-wrap items-center gap-2 ${open?'justify-between':'justify-center'}`}>
  {open&&<h2 className="text-base font-semibold">{r.panesTitle}</h2>}
  <PaneDrawerToggle open={open} onToggle={onToggle}/>
  <PaneListToggle/>
 </div>
}
