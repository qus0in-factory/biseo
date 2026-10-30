import type{TurnRecord}from'../domain/timeline-record.js'
export const TURN_COLS=`request_id,workspace_id,owner_subject,pane_id,target_name,agent_kind,prompt_text,status,response_text,error_code,created_at,updated_at,completed_at`
export const asRecord=(r:Record<string,unknown>):TurnRecord=>({
 requestId:String(r.request_id),workspaceId:String(r.workspace_id),ownerSubject:String(r.owner_subject),
 paneId:String(r.pane_id),targetName:String(r.target_name),agentKind:(r.agent_kind as string|null)??null,
 promptText:String(r.prompt_text),status:r.status as TurnRecord['status'],responseText:(r.response_text as string|null)??null,
 errorCode:(r.error_code as string|null)??null,createdAt:String(r.created_at),updatedAt:String(r.updated_at),
 completedAt:(r.completed_at as string|null)??null
})
