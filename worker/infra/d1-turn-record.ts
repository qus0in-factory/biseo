import type{TurnRecord}from'../domain/timeline-record.js'
export const asRecord=(r:Record<string,unknown>):TurnRecord=>({
 seq:Number(r.seq),requestId:String(r.request_id),
 workspaceId:String(r.workspace_id),ownerSubject:String(r.owner_subject),
 paneId:String(r.pane_id),targetName:String(r.target_name),
 terminalId:(r.terminal_id as string|null)??null,
 agentKind:(r.agent_kind as string|null)??null,promptText:String(r.prompt_text),
 status:r.status as TurnRecord['status'],
 responseText:(r.response_text as string|null)??null,
 errorCode:(r.error_code as string|null)??null,
 createdAt:String(r.created_at),updatedAt:String(r.updated_at),
 completedAt:(r.completed_at as string|null)??null,
})
