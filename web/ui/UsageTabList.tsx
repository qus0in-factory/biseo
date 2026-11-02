import{TabsList,TabsTrigger}from'../components/ui/tabs'
import type{UsageProvider}from'../domain/usage'
import{UsageTabButton}from'./UsageTabButton'
import{SortableItem}from'./sortable/SortableItem'
import{SortableList}from'./sortable/SortableList'
import r from'../resources.json'

type P={providers:UsageProvider[];bookmarks:string[];onToggleBookmark:(id:string)=>void;onMove:(from:number,to:number)=>void}

export function UsageTabList({providers,bookmarks,onToggleBookmark,onMove}:P){
 return<TabsList className="min-w-0 flex-1 flex-nowrap justify-start overflow-x-auto">
  <TabsTrigger value="bookmarked" className="shrink-0">{r.usageBookmarkedTab}</TabsTrigger>
  <SortableList ids={providers.map(p=>p.provider)} axis="horizontal" onReorder={onMove}>
   {providers.map(p=><SortableItem key={p.provider} id={p.provider}>{s=><UsageTabButton provider={p.provider} bookmarked={bookmarks.includes(p.provider)} onToggle={()=>onToggleBookmark(p.provider)} sortable={s}/>}</SortableItem>)}
  </SortableList>
 </TabsList>
}
