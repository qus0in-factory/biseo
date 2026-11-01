import { refreshGuard } from './refresh-guard.js'
import { readRefreshCookie, setRefreshCookie } from './refresh-cookie.js'
import { refreshHash } from '../infra/refresh-secret.js'
import { readRefresh, revokeRefresh } from '../infra/refresh-read.js'
import { setSessionCookie } from './login-deps.js'
import { jsonNoStore, type Ctx } from './timeline-guards.js'

export async function handleLogout(c: Ctx) {
 const denied = refreshGuard(c)
 if (denied) return denied
 try {
  const db = c.env.BISEO_DB
  if (!db) throw new Error('storage unavailable')
  const token = readRefreshCookie(c)
  const s = token && await readRefresh(db,await refreshHash(token),new URL(c.req.url).host)
  if (s) await revokeRefresh(db,s.id,Math.floor(Date.now()/1000))
  setSessionCookie(c,'',0)
  setRefreshCookie(c,'',0)
  return jsonNoStore(c,{ok:true},200)
 } catch { return jsonNoStore(c,{error:'temporarily_unavailable'},503) }
}
