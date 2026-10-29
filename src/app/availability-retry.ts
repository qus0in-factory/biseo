import type{Availability}from'../domain/timeline.js'
type Timer={t:ReturnType<typeof setTimeout>;at:number}
const timers=new Map<string,Timer>()
export function retryAt(pane:string,a:Availability,run:()=>void){
 const at=a.resetsAt?Date.parse(a.resetsAt):NaN
 if(!(at>Date.now()))return
 const old=timers.get(pane)
 if(old?.at===at)return
 if(old)clearTimeout(old.t)
 const ms=Math.min(at-Date.now()+100,2147483647)
 const t=setTimeout(()=>{if(timers.get(pane)?.t===t){timers.delete(pane);run()}},ms)
 t.unref?.()
 timers.set(pane,{t,at})
}
export function clearRetry(pane:string){
 const old=timers.get(pane)
 if(!old)return
 clearTimeout(old.t)
 timers.delete(pane)
}
export function hasRetry(pane:string){return timers.has(pane)}
