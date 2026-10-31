import type { RefreshSession } from '../domain/refresh-types.js'

export function readRefresh(db: D1Database, hash: string, host: string) {
 return db.prepare(`SELECT s.* FROM refresh_sessions s
 JOIN refresh_tokens t ON t.family=s.id WHERE t.hash=? AND s.host=?`)
 .bind(hash, host).first<RefreshSession>()
}
export function revokeRefresh(db: D1Database, id: string, now: number) {
 return db.prepare('UPDATE refresh_sessions SET revoked=? WHERE id=?')
 .bind(now, id).run()
}
