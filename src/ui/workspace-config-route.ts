import type {Context} from 'hono'
export function workspaceConfig(d:{allowedWorkspaceId?:string}) {
 return (c:Context)=>{
  const workspaceId=d.allowedWorkspaceId
  return workspaceId?c.json({workspaceId},200,{'Cache-Control':'no-store'}):
   c.json({error:'workspace_not_configured'},503,{'Cache-Control':'no-store'})
 }
}
