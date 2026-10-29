import type{TimelineItem,TurnStatus}from'../domain/timeline.js'
export type Patch={status:TurnStatus;responseText?:string|null;errorCode?:string|null;completedAt?:string|null}
export class TurnStore{
 private items=new Map<string,TimelineItem>()
 private subs=new Set<(i:TimelineItem)=>void>()
 private seq=0
 next(){return ++this.seq}
 get(id:string){return this.items.get(id)}
 add(i:TimelineItem){this.items.set(i.requestId,i);this.seq=Math.max(this.seq,i.seq);this.emit(i)}
 update(id:string,p:Patch){
  const old=this.items.get(id)
  if(!old)return
  const i={...old,...p}
  this.items.set(id,i)
  this.emit(i)
 }
 subscribe(f:(i:TimelineItem)=>void){this.subs.add(f);return()=>{this.subs.delete(f)}}
 private emit(i:TimelineItem){for(const f of this.subs)f(i)}
}
