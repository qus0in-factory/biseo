import type{AgentSession}from'../domain/herdr.js'
import {readCodexSession}from'./codex-session.js'
type X={pane_id:string;agent?:string|null;agent_session?:AgentSession|null}
export async function withCodex<T extends X>(x:T|undefined):Promise<T|undefined>{
 if(!x||x.agent_session||x.agent!=='codex')return x
 const s=await readCodexSession(x.pane_id)
 return s?{...x,agent_session:s}:x
}
export async function withCodexAll<T extends X>(xs:T[]):Promise<T[]>{
 return (await Promise.all(xs.map(x=>withCodex(x)))) as T[]
}
