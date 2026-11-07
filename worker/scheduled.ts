import{scheduledWorkspace}from'./scheduled-workspace.js'
import{queueTick}from'./queue-tick.js'
import{meterDb}from'./infra/d1-row-meter.js'
import{logCronTick}from'./infra/cron-tick-log.js'
import{runStep}from'./scheduled-step.js'
import{syncSteps}from'./scheduled-sync.js'
import type{CronEnv}from'./scheduled-env.js'
export async function scheduled(_e:ScheduledController,env:CronEnv,_ctx:ExecutionContext){
 const raw=env.BISEO_DB
 if(!raw)return
 const started=Date.now(),{db,counts}=meterDb(raw),requestId=crypto.randomUUID(),steps=[]
 let ws:string|null=null
 steps.push(await runStep('herdr-config',async()=>{
  const p=await scheduledWorkspace(env,requestId)
  ws=p.workspaceId
  return p.status==='ok'?{status:'ok'}:{status:'fail',code:p.code}
 }))
 steps.push(await runStep('queue-tick',async()=>{await queueTick(db,env);return{status:'ok'}}))
 try{await syncSteps(db,env,ws,steps)}
 finally{logCronTick(steps,counts,Date.now()-started,requestId)}
}
