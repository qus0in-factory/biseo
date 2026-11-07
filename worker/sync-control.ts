import{recordResult}from'./infra/d1-backoff.js'
import type{D1Database}from'@cloudflare/workers-types'
import type{TickStep}from'./infra/cron-tick-log.js'
const miss=(c:string):TickStep=>({component:c,status:'skipped',code:'not_run',durationMs:0})
export function gateFailed(o:TickStep[]){
 o.push({component:'sync-gate',status:'fail',code:'exception',durationMs:0},miss('turn-reconcile'),miss('usage-sync'))
}
export async function noteResult(db:D1Database,key:string,failed:boolean,o:TickStep[]){
 try{await recordResult(db,key,failed)}catch{o.push({component:'sync-backoff',status:'fail',code:'exception',durationMs:0})}
}
