import{callUpstreamJson}from'./infra/herdr-upstream-http.js'
import{logCode}from'./infra/log-event.js'
import type{CronEnv}from'./scheduled-env.js'
export type WorkspaceProbe={workspaceId:string|null;status:'ok'|'fail';code?:string}
export async function scheduledWorkspace(env:CronEnv,requestId=crypto.randomUUID()):Promise<WorkspaceProbe>{
 const r=await callUpstreamJson<{workspaceId:string}>(env,'/herdr/config','GET',undefined,requestId)
 if(r.ok&&r.data.workspaceId)return{workspaceId:r.data.workspaceId,status:'ok'}
 return{workspaceId:null,status:'fail',code:r.ok?'unknown':logCode(r.body.error)}
}
