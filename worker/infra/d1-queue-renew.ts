import type{D1Database}from'@cloudflare/workers-types'
import{fencedUpdate,type QueueLease}from'./d1-queue-fence.js'
export function renewTurn(db:D1Database,l:QueueLease,ttl:number){
 if(!Number.isSafeInteger(ttl)||ttl<=0)throw new Error('invalid_lease')
 return fencedUpdate(db,l,'lease_until=?',[l.now+ttl])
}
