import type{Socket}from'node:net'
import {parseReply}from'../domain/herdr-event.js'
import {handle}from'./herdr-subscribe-line.js'
export function handshake(sock:Socket,onEvent:(e:string)=>void,onClose:()=>void,close:()=>void,timeoutMs:number):Promise<void>{
 return new Promise((resolve,reject)=>{
  let buf='',timer:ReturnType<typeof setTimeout>
  const fail=(e?:unknown)=>{clearTimeout(timer);reject(e instanceof Error?e:new Error('herdr_events_unavailable'))}
  const ok=()=>{clearTimeout(timer);resolve()}
  timer=setTimeout(()=>{fail(new Error('herdr_events_timeout'));close()},timeoutMs)
  sock.on('error',fail)
  sock.on('close',()=>{fail();onClose()})
  sock.on('data',(d)=>{
   buf+=d.toString()
   const lines=buf.split('\n');buf=lines.pop()??''
   for(const l of lines)handle(parseReply(l),{resolve:ok,reject:fail,onEvent,onClose,close})
  })
 })
}
