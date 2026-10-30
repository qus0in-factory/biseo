import type{TimelineItem}from'../domain/timeline'
import type{AsyncState}from'../domain/asyncState'
import{listState}from'../domain/asyncListState'
import{TimelineAsync}from'./TimelineAsync'
import r from'../resources.json'
type P={items:TimelineItem[];onCancel?:(id:string)=>void;onLoadOlder?:()=>void;olderLoaded?:number;state?:AsyncState<TimelineItem[]>;onRetry?:()=>void}
export function TimelineView({items,onCancel,onLoadOlder,olderLoaded,state:given,onRetry}:P){
 const state=given??listState(items,false,null)
 if(items.length === 0 && state.status === 'empty')return <p className="flex-1 text-sm text-muted-foreground">{r.emptyTimeline}</p>
 return <TimelineAsync items={items} onCancel={onCancel} onLoadOlder={onLoadOlder} olderLoaded={olderLoaded} state={state} onRetry={onRetry}/>
}
