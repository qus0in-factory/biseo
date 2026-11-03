import { Gauge } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import r from '../resources.json'
type P={value:string|null;onSelect:(v:string|null)=>void}
export function HeaderTabs({value,onSelect}:P){
 return(
  <Tabs value={value??undefined} onValueChange={onSelect} className="min-w-0">
   <TabsList className="max-w-full gap-1 bg-transparent p-0">
    <TabsTrigger value="usage" className="shrink-0 gap-2 rounded-md hover:bg-muted"><Gauge size={16}/>{r.usageTab}</TabsTrigger>
   </TabsList>
  </Tabs>
 )
}
