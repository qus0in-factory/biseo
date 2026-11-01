import { PaneDrawerToggle } from './PaneDrawerToggle'
import { PaneListToggle } from './PaneListToggle'
import r from '../resources.json'
type Props = {
 open: boolean
 onToggle: () => void
}
export function PaneDrawerHeader({open,onToggle}:Props){
 return <div className={`flex gap-2 ${open?'items-center justify-between':'items-start flex-col'}`}>
  {open&&<h2 className="text-base font-semibold">{r.panesTitle}</h2>}
  <div className={`flex gap-1 ${open?'':'flex-col'}`}>
   <PaneDrawerToggle open={open} onToggle={onToggle}/>
   <PaneListToggle/>
  </div>
 </div>
}
