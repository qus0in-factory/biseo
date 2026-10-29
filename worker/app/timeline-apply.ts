import type{D1Database}from'@cloudflare/workers-types'
import type{TurnStatus}from'../domain/timeline-types.js'
import{patchTurn}from'../infra/d1-timeline-patch.js'
const STATUS=new Set<TurnStatus>(['queued','working','completed','capture_unavailable','blocked','failed','timeout','cancelled'])
const str=(v:unknown)=>typeof v==='string'?v:null
export async function applyResult(db:D1Database,id:string,body:Record<string,unknown>){
 const status=STATUS.has(body.status as TurnStatus)?body.status as TurnStatus:'queued'
 const terminal=status!=='queued'&&status!=='working'&&status!=='timeout'
 await patchTurn(db,id,{status,responseText:str(body.responseText),errorCode:str(body.errorCode),completedAt:str(body.completedAt)??(terminal?new Date().toISOString():undefined),targetName:str(body.targetName)??undefined,agentKind:str(body.agentKind)??undefined})
}
