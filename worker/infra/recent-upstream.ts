import type{RecentResponse}from'../../shared/domain/recent-response.js'
import type{UpstreamEnv}from'./herdr-upstream-config.js'
import{callUpstreamJson}from'./herdr-upstream-http.js'
export function recentUpstream(env:UpstreamEnv,workspace:string,pane:string){
 const path=`/herdr/workspaces/${encodeURIComponent(workspace)}/panes/${encodeURIComponent(pane)}/recent`
 return callUpstreamJson<{recent:RecentResponse|null}>(env,path,'POST',{},crypto.randomUUID())
}
