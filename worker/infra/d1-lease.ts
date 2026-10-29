import type{D1Database}from'@cloudflare/workers-types'
export async function acquireLease(db:D1Database,key:string,holder:string,ttlMs:number){
 const now=Date.now(),until=now+ttlMs
 const r=await db.prepare(`INSERT INTO sync_state (key,holder,expires_at,next_at) VALUES (?,?,?,0)
  ON CONFLICT(key) DO UPDATE SET holder=excluded.holder,expires_at=excluded.expires_at
  WHERE sync_state.expires_at<=?`).bind(key,holder,until,now).run()
 return !!r.meta.changes
}
export async function releaseLease(db:D1Database,key:string,holder:string){
 await db.prepare('UPDATE sync_state SET expires_at=0 WHERE key=? AND holder=?').bind(key,holder).run()
}
