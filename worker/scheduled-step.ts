import type{TickOutcome,TickStep}from'./infra/cron-tick-log.js'
export async function runStep(component:string,run:()=>Promise<TickOutcome>):Promise<TickStep>{
 const started=Date.now()
 try{const outcome=await run();return{component,durationMs:Date.now()-started,...outcome}}
 catch{return{component,status:'fail',code:'exception',durationMs:Date.now()-started}}
}
