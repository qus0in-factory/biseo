import type{D1Database}from'@cloudflare/workers-types'
export type QueueLease={id:string;token:string;now:number}
export async function fencedUpdate(
 db:D1Database,l:QueueLease,set:string,values:(string|number|null)[],
){
 const r=await db.prepare(`UPDATE timeline_turns SET ${set}
 WHERE request_id=? AND lease_token=? AND lease_until>?
 AND status IN ('queued','working')`).bind(...values,l.id,l.token,l.now).run()
 return !!r.meta.changes
}
