import type{D1Database}from'@cloudflare/workers-types'
export async function nextReadyAt(db:D1Database,key:string){
 const r=await db.prepare('SELECT next_at FROM sync_state WHERE key=?').bind(key).first<{next_at:number}>()
 return Number(r?.next_at??0)
}
export async function recordResult(db:D1Database,key:string,failed:boolean){
 const r=await db.prepare('SELECT failures FROM sync_state WHERE key=?').bind(key).first<{failures:number}>()
 const f=failed?Math.min(Number(r?.failures??0)+1,4):0
 const delay=failed?Math.min(60000*2**f,900000):60000
 await db.prepare(`INSERT INTO sync_state (key,holder,expires_at,next_at,failures) VALUES (?,'',0,?,?)
  ON CONFLICT(key) DO UPDATE SET next_at=excluded.next_at,failures=excluded.failures`).bind(key,Date.now()+delay,f).run()
}
