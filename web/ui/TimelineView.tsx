import type{TimelineItem}from'../domain/timeline'
import{TimelineItemView}from'./TimelineItemView'
import{useTimelineScroll}from'./useTimelineScroll'
import{JumpToBottomButton}from'./JumpToBottomButton'
import r from'../resources.json'

type P={items:TimelineItem[];onCancel?:(id:string)=>void;onLoadOlder?:()=>void;olderLoaded?:number}

export function TimelineView({items,onCancel,onLoadOlder,olderLoaded}:P){
 const{ref,showJump,scrollToBottom,onScroll}=useTimelineScroll(items,onLoadOlder,olderLoaded)
 if(items.length === 0)return <p className="flex-1 text-sm text-muted-foreground">{r.emptyTimeline}</p>
 return(
  <div className="relative flex min-h-0 flex-1 flex-col">
   <div ref={ref} className="flex flex-1 flex-col gap-3 overflow-y-auto overscroll-contain" onScroll={onScroll}>
    {items.map(i=><TimelineItemView key={i.requestId} item={i} onCancel={onCancel}/>)}
   </div>
   {showJump&&<JumpToBottomButton onClick={scrollToBottom}/>}
  </div>
 )
}
