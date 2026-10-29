import type{CaptureReader}from'./ports.js'
import{isCurrentTurn}from'./pane-generation.js'
import{readResponse}from'./read-response.js'
const chunk=5000
export function continueLate(pane:string,gen:number,reader:CaptureReader,ms:number|undefined,done:(text:string)=>void){
 if(!(ms&&ms>0))return
 void (async()=>{
  const end=Date.now()+ms
  while(isCurrentTurn(pane,gen)){
   const left=end-Date.now()
   if(left<=0)return
   const t0=Date.now()
   const r=await readResponse(reader,Math.min(left,chunk))
   if(r.error||!isCurrentTurn(pane,gen))return
   if(r.text)return done(r.text)
   const pause=Math.min(end-Date.now(),chunk-(Date.now()-t0))
   if(pause>0)await new Promise(x=>setTimeout(x,pause))
  }
 })().catch(()=>{})
}
