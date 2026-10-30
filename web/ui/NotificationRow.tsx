import type{NotificationItem}from'../domain/notifications'
import{TurnStatusBadge}from'./TurnStatusBadge'
import{formatZoned}from'../domain/formatZoned'
import r from'../resources.json'
export function NotificationRow({item,onOpen}:{item:NotificationItem;onOpen:()=>void}){
 return(
  <li>
   <button type="button" onClick={onOpen} aria-label={r.notifyOpen} className={`flex w-full flex-col gap-1 border-b border-border/60 px-1 py-2 text-left ${item.read?'opacity-60':''}`}>
    <span className="flex items-center justify-between gap-2">
     <span className="truncate text-sm font-medium">{item.paneName}</span>
     <TurnStatusBadge status={item.status}/>
    </span>
    {item.text&&<span className="line-clamp-2 text-xs text-muted-foreground">{item.text}</span>}
    <span className="text-xs text-muted-foreground">{formatZoned(item.createdAt,r.displayTimeZone)}</span>
   </button>
  </li>
 )
}
