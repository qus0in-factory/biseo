import type { RefreshPolicy, RefreshSession } from '../domain/refresh-types.js'

export async function createRefresh(db: D1Database, s: RefreshSession,
 p: RefreshPolicy, now: number) {
 const results = await db.batch([
  db.prepare('DELETE FROM refresh_sessions WHERE expires<? OR revoked<?')
   .bind(now-p.retention,now-p.retention),
  db.prepare(`INSERT INTO refresh_sessions
   SELECT ?,?,?,?,?,0,?,?,NULL WHERE
   (SELECT count(*) FROM refresh_sessions WHERE subject=? AND host=?
    AND revoked IS NULL AND expires>? AND idle>?)<?`)
   .bind(s.id,s.subject,s.host,s.auth,s.current_hash,s.expires,s.idle,
    s.subject,s.host,now,now,p.maximum),
  db.prepare(`INSERT INTO refresh_tokens SELECT current_hash,id,0
   FROM refresh_sessions WHERE id=?`).bind(s.id),
 ])
 return results[1].meta.changes === 1
}
