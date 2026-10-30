import type{D1Database}from'@cloudflare/workers-types'
import type{TurnRecord}from'../domain/timeline-record.js'
import{markRecoveryPending,patchTurn}from'../infra/d1-timeline-patch.js'
export const RETRY_MS=300000
export async function reconcileMissing(db:D1Database,r:TurnRecord):Promise<TurnRecord>{
 if(r.errorCode==='recovery_pending'){
  const at=new Date().toISOString()
  await patchTurn(db,r.requestId,{status:'failed',errorCode:'recovery_lost',completedAt:at})
  return{...r,status:'failed',errorCode:'recovery_lost',completedAt:at}
 }
 await markRecoveryPending(db,r.requestId,Date.now()+RETRY_MS)
 return{...r,errorCode:'recovery_pending'}
}
