import type{D1Database}from'@cloudflare/workers-types'
import{asRecord}from'./d1-timeline-cols.js'
import{CLAIM_SQL}from'./d1-queue-claim-sql.js'
import{QUEUE_MAX_ATTEMPTS}from'../domain/queue-policy.js'
export async function claimTurn(
 db:D1Database,workspace:string,pane:string,token:string,now:number,ttl:number,
){
 if(!token||!Number.isSafeInteger(now)||!Number.isSafeInteger(ttl)||ttl<=0)
  throw new Error('invalid_lease')
 const row=await db.prepare(CLAIM_SQL).bind(token,now+ttl,workspace,pane,now,QUEUE_MAX_ATTEMPTS)
  .first<Record<string,unknown>>()
 return row?asRecord(row):null
}
