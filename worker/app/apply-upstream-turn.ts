import type{D1Database}from'@cloudflare/workers-types'
import type{TimelineItem}from'../domain/timeline-types.js'
import type{TurnRecord}from'../domain/timeline-record.js'
import{patchTurn}from'../infra/d1-timeline-patch.js'
export async function applyUpstreamTurn(db:D1Database,r:TurnRecord,i:TimelineItem):Promise<TurnRecord>{
 await patchTurn(db,r.requestId,{status:i.status,responseText:i.responseText,errorCode:i.errorCode,completedAt:i.completedAt,targetName:i.targetName,agentKind:i.agentKind})
 return{...r,status:i.status,responseText:i.responseText,errorCode:i.errorCode,completedAt:i.completedAt,targetName:i.targetName,agentKind:i.agentKind}
}
