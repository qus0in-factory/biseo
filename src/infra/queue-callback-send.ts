import{logger}from'./logger.js'
export async function sendQueueCallback(
 target:Promise<string|undefined>,ms:number,requestId:string,token:string,
){
 try{
  const url=await target
  if(!url)return
  const response=await fetch(url,{method:'POST',redirect:'error',
   signal:AbortSignal.timeout(ms),headers:{'Content-Type':'application/json'},
   body:JSON.stringify({requestId,token})})
  if(!response.ok)logger.warn({status:response.status},'queue.callback_rejected')
 }catch{
  logger.warn('queue.callback_failed')
 }
}
