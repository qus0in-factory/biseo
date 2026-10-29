import {PaneLocks}from'../app/pane-locks.js'
import {TurnStore}from'../app/turn-store.js'
import {agent,pane}from'../app/turn-data-fixture.js'
export async function readEvent(b:ReadableStream<Uint8Array>,p:RegExp,ms=1500){
 const r=b.getReader(),d=new TextDecoder()
 let s='',t:NodeJS.Timeout|undefined
 const to=new Promise<null>(x=>{t=setTimeout(()=>{void b.cancel().catch(()=>{});x(null)},ms)})
 try{for(;;){const n=await Promise.race([r.read(),to]);if(!n||n.done)break;s+=d.decode(n.value);if(p.test(s))break}}
 finally{clearTimeout(t);try{r.releaseLock()}catch{}}
 return s
}
export function lockDeps(l: PaneLocks,listPanes:()=>Promise<typeof pane[]> = async()=>[pane],listAgents:()=>Promise<typeof agent[]> = async()=>[agent]){
 return {herdr:{listPanes,listAgents},store:new TurnStore(),locks:l}
}
export class TrackedLocks extends PaneLocks{
 off=0
 subscribe(f:(p:string)=>void){const o=super.subscribe(f);return()=>{this.off++;o()}}
}
