import type{TurnStore}from'../app/turn-store.js'
import{base}from'../config-file.js'
import{serviceConfig}from'../config-service.js'
import{queueCallbackUrl}from'./queue-callback-url.js'
export function queueCompletion(store:TurnStore,id:string,token:unknown){
 const url=queueCallbackUrl(serviceConfig,base.queueCallbackUrl,process.env.QUEUE_CALLBACK_URL)
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
