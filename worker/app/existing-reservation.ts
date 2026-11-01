import type{D1Database}from'@cloudflare/workers-types'
import type{SubmitMessageInput}from'../domain/message-input.js'
import{findTurn}from'../infra/d1-timeline-find.js'
export async function existingReservation(db:D1Database,i:SubmitMessageInput,owner:string){
 const rec=await findTurn(db,{workspaceId:i.workspaceId,ownerSubject:owner},i.requestId)
 if(!rec)return null
 if(rec.paneId!==i.paneId||rec.promptText!==i.text)return{kind:'conflict' as const}
 return{kind:'existing' as const,rec}
}
