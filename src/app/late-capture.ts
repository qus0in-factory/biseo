import type{LateOpts}from'./late-types.js'
import{pollLateStep}from'./poll-late-step.js'
const chunk=5000
export function continueLate(o:LateOpts){
 const ms=o.ms
 if(!(ms&&ms>0))return
 const start=Date.now()
 void (async()=>{
  try{
   while(o.isLive()){
    const left=ms-(Date.now()-start)
    const budget=left>0?Math.min(left,chunk):chunk
    const ok=await pollLateStep(o,budget)
    if(!ok||!o.isLive())return
    await new Promise(x=>setTimeout(x,1000))
   }
  }finally{o.rdr.close?.()}
 })()
}