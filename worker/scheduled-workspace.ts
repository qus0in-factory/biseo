import{callUpstreamJson}from'./infra/herdr-upstream-http.js'
import type{CronEnv}from'./scheduled-env.js'
export async function scheduledWorkspace(env:CronEnv){
 const r=await callUpstreamJson<{workspaceId:string}>(env,'/herdr/config','GET',undefined,crypto.randomUUID())
 return r.ok&&r.data.workspaceId?r.data.workspaceId:null
}
