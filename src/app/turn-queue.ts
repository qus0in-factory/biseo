import type{TimelineItem}from'../domain/timeline.js'
export class TurnQueue{
 private q=new Map<string,TimelineItem[]>()
 private s=new Set<string>()
 private a=new Set<string>()
 add(i:TimelineItem){const a=this.q.get(i.paneId)??[];a.push(i);this.q.set(i.paneId,a)}
 peek(p:string){return this.q.get(p)?.[0]}
 shift(p:string){const a=this.q.get(p),i=a?.shift();if(a&&!a.length)this.q.delete(p);return i}
 remove(id:string){for(const[p,a]of this.q){const n=a.findIndex(i=>i.requestId===id);if(n<0)continue;const[i]=a.splice(n,1);if(!a.length)this.q.delete(p);return i}}
 has(p:string){return !!this.q.get(p)?.length}
 panes(){return[...this.q.keys()]}
 begin(p:string){if(this.s.has(p)){this.a.add(p);return false}this.s.add(p);return true}
 end(p:string){const r=this.a.delete(p);this.s.delete(p);return r}
}
