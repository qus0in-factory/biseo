import{parseSubmitMessageInput}from'../domain/message-input.js'
import{verifyAllowedWorkspace}from'../domain/workspace-guard.js'
import{type Ctx,jsonNoStore}from'./timeline-guards.js'
import{badRequest}from'./timeline-submit-context.js'
export async function parseSubmit(c:Ctx){
 const b=await c.req.json().catch(()=>null)
 const input=parseSubmitMessageInput(b)
 if(!input)return{ok:false as const,res:badRequest(c)}
 const ws=verifyAllowedWorkspace(c.env.ALLOWED_WORKSPACE_ID,input.workspaceId)
 if(!ws.ok)return{ok:false as const,res:jsonNoStore(c,{error:ws.error,...ws.reason?{reason:ws.reason}:{}},ws.status)}
 return{ok:true as const,input,ws:ws.workspaceId}
}
