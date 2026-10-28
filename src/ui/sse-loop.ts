import type{SSEStreamingApi}from'hono/streaming'
import {logger}from'../infra/logger.js'
import {startSseLog}from'../infra/sse-log.js'
export type Loop={closed:()=>boolean;refresh:()=>void;send:()=>Promise<void>;end:(c?:unknown)=>void;beat:()=>void;ended:Promise<void>}
export function sseLoop(s:SSEStreamingApi,write:()=>Promise<void>,onEnd:()=>void,ms=15000,log=logger):Loop{
 let closed=false,t:NodeJS.Timeout|undefined,hb:NodeJS.Timeout|undefined,done=()=>{}
 const ended=new Promise<void>(r=>{done=r}),closeLog=startSseLog(log)
 const end=(c?:unknown)=>{if(!closed){closed=true;clearTimeout(t);clearInterval(hb);closeLog(s.aborted,c);onEnd();done()}}
 const send=async()=>{if(!closed)try{await write()}catch{end('write_error')}}
 const refresh=()=>{clearTimeout(t);t=setTimeout(()=>void send(),120)}
 const beat=()=>{hb=setInterval(()=>{if(!closed)void s.writeSSE({event:'heartbeat',data:'{}'}).catch(()=>end('heartbeat_error'))},ms)}
 return {closed:()=>closed,refresh,send,end,beat,ended}
}
