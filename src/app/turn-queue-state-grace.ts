import{queueState,type State}from'./turn-queue-state.js'
import type{TurnDeps}from'./turn-deps.js'
export async function stateWithGrace(d:TurnDeps,pane:string,ms:number):Promise<State>{
 const s=await queueState(d,pane)
 if(!('reason'in s)||s.reason!=='target_not_found'||ms<=0)return s
 await new Promise(r=>setTimeout(r,ms))
 return queueState(d,pane)
}
