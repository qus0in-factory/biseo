import type{TimelineItem}from'../domain/timeline'
import type{AsyncState}from'../domain/asyncState'
import{AsyncList}from'./AsyncList'
import{TimelineScrollBody}from'./TimelineScrollBody'
import r from'../resources.json'
type P={items:TimelineItem[];onCancel?:(id:string)=>void;onLoadOlder?:()=>void;olderLoaded?:number;onReachBottom?:()=>void;state:AsyncState<TimelineItem[]>;onRetry?:()=>void}
export function TimelineAsync({items,onCancel,onLoadOlder,olderLoaded,onReachBottom,state,onRetry}:P){
 return(
  <AsyncList state={state} empty={<p className="flex-1 text-sm text-muted-foreground">{r.emptyTimeline}</p>} errorText={r.timelineError} onRetry={onRetry}>
   {()=><TimelineScrollBody items={items} onCancel={onCancel} onLoadOlder={onLoadOlder} olderLoaded={olderLoaded} onReachBottom={onReachBottom}/>}
  </AsyncList>
 )
}
