import type{Availability}from'../domain/timeline.js'
const timers=new Map<string,ReturnType<typeof setTimeout>>()
export function retryAt(pane:string,a:Availability,run:()=>void){
 const at=a.resetsAt?Date.parse(a.resetsAt):NaN
 if(!(at>Date.now()))return
 const old=timers.get(pane)
 if(old)clearTimeout(old)
 const ms=Math.min(at-Date.now()+100,2147483647)
 const t=setTimeout(()=>{timers.delete(pane);run()},ms)
 t.unref?.()
 timers.set(pane,t)
}
