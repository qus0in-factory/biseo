import{snap,type EventSub}from'./first-session-snap.js'
import type{AgentSession}from'../domain/herdr.js'
import type{HerdrPort}from'./ports.js'
export async function waitFirstSession(h:HerdrPort,p:string,t:string,ms:number,shut:()=>boolean,sub:EventSub):Promise<AgentSession|null>{
 if(shut())return null
 const f=await snap(h,p,t)
 if(f!==0)return f
 return new Promise(res=>{
  let done=false,u:(()=>void)|undefined
  const fin=(v:AgentSession|null)=>{if(done)return;done=true;clearTimeout(to);u?.();res(v)}
  const to=setTimeout(()=>fin(null),ms)
  const on=async()=>{
   if(done||shut())return fin(null)
   const r=await snap(h,p,t)
   if(done||shut())return fin(null)
   if(r!==0)fin(r)
  }
  sub([p],()=>{void on()},()=>fin(null)).then(x=>{u=x;if(done)x();else void on()}).catch(()=>fin(null))
 })
}
