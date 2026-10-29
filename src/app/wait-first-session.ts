import{isOpencodeSession}from'../domain/first-session.js'
import type{AgentSession}from'../domain/herdr.js'
import type{HerdrPort}from'./ports.js'
const gap=100
const sleep=(n:number)=>new Promise(r=>setTimeout(r,n))
export async function waitFirstSession(h:HerdrPort,pane:string,term:string,ms:number,shut:()=>boolean):Promise<AgentSession|null>{
 const end=Date.now()+ms
 for(;;){
  const p=await h.getPane(pane).catch(()=>undefined)
  if(p&&p.terminal_id===term){
   const a=await h.getAgent(pane).catch(()=>undefined)
   const k=a?.agent??p.agent??null,s=a?.agent_session??p.agent_session??undefined
   if(k==='opencode'&&isOpencodeSession(s))return s??null
   if(k!==null&&k!=='opencode')return null
  }else if(p)return null
  if(Date.now()>=end||shut())return null
  await sleep(gap)
 }
}
