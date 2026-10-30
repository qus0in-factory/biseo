import{verifyAllowedWorkspace}from'../domain/workspace-guard.js'
import{type Ctx,jsonNoStore,requireOwner}from'./timeline-guards.js'
import{requireDb}from'./storage-guard.js'
export async function readContext(c:Ctx,requested?:string){
 const a=await requireOwner(c);if(!a.ok)return{ok:false as const,res:a.res}
 const d=requireDb(c);if(!d.ok)return{ok:false as const,res:d.res}
 const ws=verifyAllowedWorkspace(c.env.ALLOWED_WORKSPACE_ID,requested)
 if(!ws.ok)return{ok:false as const,res:jsonNoStore(c,{error:ws.error,...ws.reason?{reason:ws.reason}:{}},ws.status)}
 return{ok:true as const,owner:a.claims.sub,db:d.db,ws:ws.workspaceId}
}
