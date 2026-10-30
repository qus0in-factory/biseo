import type{LateOpts}from'./late-types.js'
import{pollLateStep}from'./poll-late-step.js'
const chunk=5000
export function continueLate(o:LateOpts){
 const ms=o.ms
 if(!(ms&&ms>0))return
 void (async()=>{
  const end=Date.now()+ms
  try{
   while(o.isLive()){
    const left=end-Date.now()
    if(left<=0){if(o.isLive())o.onDone('failed','late_capture_expired');return}
    const t0=Date.now(),ok=await pollLateStep(o,Math.min(left,chunk))
    if(!ok||!o.isLive())return
    const pause=Math.min(end-Date.now(),chunk-(Date.now()-t0))
    if(pause>0)await new Promise(x=>setTimeout(x,pause))
   }
  }finally{o.rdr.close?.()}
 })()
}
