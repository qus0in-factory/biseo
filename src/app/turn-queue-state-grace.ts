import{queueState,type State}from'./turn-queue-state.js'
import type{HerdrPort}from'./ports.js'
export async function stateWithGrace(h:HerdrPort,pane:string,ms:number):Promise<State>{
 const s=await queueState(h,pane)
 if(!('reason'in s)||s.reason!=='target_not_found'||ms<=0)return s
 await new Promise(r=>setTimeout(r,ms))
 return queueState(h,pane)
}
