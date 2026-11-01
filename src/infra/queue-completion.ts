import type{TurnStore}from'../app/turn-store.js'
import{base}from'../config-file.js'
export function queueCompletion(store:TurnStore,id:string,token:unknown){
 const url=process.env.QUEUE_CALLBACK_URL??base.queueCallbackUrl
 const ms=Number(process.env.QUEUE_CALLBACK_TIMEOUT_MS??base.queueCallbackTimeoutMs)
 if(!url||typeof token!=='string'||!Number.isSafeInteger(ms)||ms<=0)return()=>{}
 const unsub=store.subscribe(i=>{
  if(i.requestId!==id||i.status==='queued'||i.status==='working')return
  unsub()
  void fetch(url,{method:'POST',redirect:'error',signal:AbortSignal.timeout(ms),
   headers:{'Content-Type':'application/json'},body:JSON.stringify({requestId:id,token})}).catch(()=>{})
 })
 return unsub
}
