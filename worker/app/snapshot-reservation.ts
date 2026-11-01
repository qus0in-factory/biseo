import type{QueuePort}from'./queue-port.js'
import type{SubmitMessageInput}from'../domain/message-input.js'
import{queuedRecord}from'./queued-turn.js'
export async function snapshotReservation(q:QueuePort,i:SubmitMessageInput,owner:string){
 const at=new Date().toISOString()
 const t=await q.target(i.workspaceId,i.paneId).catch(()=>null)
 const r=queuedRecord(i,owner,i.workspaceId,at,t?.terminalId??null)
 if(!t){r.status='failed';r.errorCode='target_unclear';r.completedAt=at}
 return r
}
