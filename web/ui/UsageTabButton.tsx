import{TabsTrigger}from'../components/ui/tabs'
import{UsageBookmarkStar}from'./UsageBookmarkStar'
import type{SortableState}from'./sortable/SortableItem'

type P={provider:string;bookmarked:boolean;onToggle:()=>void;sortable:SortableState}

export function UsageTabButton({provider,bookmarked,onToggle,sortable}:P){
 return<TabsTrigger ref={sortable.ref} value={provider} style={sortable.style} {...sortable.attributes} {...sortable.listeners} role="tab" className="shrink-0 select-none touch-none gap-1">
  <UsageBookmarkStar marked={bookmarked} onToggle={onToggle}/>
  {provider}
 </TabsTrigger>
}
