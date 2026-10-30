import { Bell, Gauge } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Badge } from '../components/ui/badge'
import { unreadCount } from '../domain/notificationList'
import { useNotificationStore } from '../app/notificationStore'
import r from '../resources.json'
type P={value:string|null;onSelect:(v:string|null)=>void}
export function HeaderTabs({value,onSelect}:P){
 const unread=useNotificationStore(s=>unreadCount(s.items))
 return(
  <Tabs value={value??undefined} onValueChange={onSelect} className="mr-auto min-w-0">
   <TabsList className="max-w-full gap-2">
    <TabsTrigger value="usage" className="shrink-0 gap-2"><Gauge size={16}/>{r.usageTab}</TabsTrigger>
    <TabsTrigger value="notify" className="shrink-0 gap-2" aria-label={r.notifyUnreadLabel.replace('{n}',String(unread))}>
     <Bell size={16}/>{r.notifyTab}{unread>0&&<Badge aria-hidden="true">{unread}</Badge>}
    </TabsTrigger>
   </TabsList>
  </Tabs>
 )
}
