import{reconcilePending}from'./scheduled-turns.js'
import{syncUsage}from'./scheduled-usage.js'
import{scheduledWorkspace}from'./scheduled-workspace.js'
import{acquireLease,releaseLease}from'./infra/d1-lease.js'
import{nextReadyAt,recordResult}from'./infra/d1-backoff.js'
import type{CronEnv}from'./scheduled-env.js'
const KEY='cron:sync'
export async function scheduled(_e:ScheduledController,env:CronEnv,_ctx:ExecutionContext){
 const db=env.BISEO_DB
 if(!db)return
 const workspaceId=await scheduledWorkspace(env)
 if(!workspaceId)return
 const holder=crypto.randomUUID()
 if(!(await acquireLease(db,KEY,holder,55000)))return
 try{
  if(await nextReadyAt(db,KEY+':backoff')>Date.now())return
  const turns=await reconcilePending(db,env,workspaceId)
  const usage=await syncUsage(db,env)
  await recordResult(db,KEY+':backoff',!turns||!usage)
 }finally{await releaseLease(db,KEY,holder)}
}
