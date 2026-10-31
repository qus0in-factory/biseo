import {callUpstreamJson} from '../infra/herdr-upstream-http.js'
import {type App,jsonNoStore,requireOwner} from './timeline-guards.js'
export function registerWorkspaceSource(app:App) {
 app.use('/api/*',async(c,next)=>{
  if(c.env.WORKSPACE_CONFIG_SOURCE!=='server'||
   c.req.path==='/api/queue/completed'||
   /^\/api\/turns\/[^/]+\/retry$/.test(c.req.path)||
   /^\/api\/(?:auth(?:\/|$)|login(?:\/|$)|logout$|session$|health$)/.test(c.req.path))return next()
  const a=await requireOwner(c)
  if(!a.ok)return a.res
  const r=await callUpstreamJson<{workspaceId:string}>(c.env,'/herdr/config','GET',undefined,crypto.randomUUID())
  if(!r.ok||!r.data.workspaceId)return jsonNoStore(c,{error:'workspace_not_configured'},502)
  c.env={...c.env,ALLOWED_WORKSPACE_ID:r.data.workspaceId}
  await next()
 })
}
