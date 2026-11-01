import type { RefreshSession } from '../domain/refresh-types.js'

export async function rotateRefresh(db: D1Database, s: RefreshSession,
 hash: string, next: string, now: number, idle: number, ip = '') {
 const results = await db.batch([
  db.prepare(`UPDATE refresh_sessions SET revoked=?
   WHERE id=? AND current_hash<>? AND revoked IS NULL`).bind(now,s.id,hash),
  db.prepare(`UPDATE refresh_sessions SET current_hash=?,generation=generation+1,idle=?
   WHERE id=? AND current_hash=? AND revoked IS NULL
   AND expires>unixepoch() AND idle>unixepoch()
   AND (auth<>'pin' OR EXISTS (SELECT 1 FROM trusted_ips WHERE ip=?))`)
   .bind(next,idle,s.id,hash,ip),
  db.prepare(`INSERT INTO refresh_tokens SELECT ?,id,generation FROM refresh_sessions
   WHERE id=? AND current_hash=? AND revoked IS NULL`).bind(next,s.id,next),
 ])
 return results[1].meta.changes === 1
}
