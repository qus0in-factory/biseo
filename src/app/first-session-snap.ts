import{isOpencodeSession}from'../domain/first-session.js'
import type{AgentSession}from'../domain/herdr.js'
import type{HerdrPort}from'./ports.js'
export type EventSub=(ids:string[],ev:(e:string)=>void,cl:()=>void)=>Promise<()=>void>
export type Snap=AgentSession|null|0
export async function snap(h:HerdrPort,p:string,t:string):Promise<Snap>{
 const q=await h.getPane(p).catch(()=>undefined)
 if(!q||q.terminal_id!==t)return null
 const a=await h.getAgent(p).catch(()=>undefined)
 const k=a?.agent??q.agent??null,s=a?.agent_session??q.agent_session??undefined
 if(k==='opencode'&&isOpencodeSession(s))return s??null
 return k!==null&&k!=='opencode'?null:0
}
