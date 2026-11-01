import { refreshGuard } from './refresh-guard.js'
import { readRefreshCookie, setRefreshCookie } from './refresh-cookie.js'
import { executeRefresh } from './refresh-execute.js'
import { setSessionCookie } from './login-deps.js'
import { jsonNoStore, type Ctx } from './timeline-guards.js'

export async function handleRefresh(c: Ctx) {
 const denied = refreshGuard(c)
 if (denied) return denied
 try {
  if (!c.env.BISEO_DB) throw new Error('storage unavailable')
  const token = readRefreshCookie(c)
  const r = token ? await executeRefresh(c,token) : null
  if (!r) return jsonNoStore(c,{error:'unauthorized'},401)
  setSessionCookie(c,r.token,r.age)
  setRefreshCookie(c,r.next,r.remaining)
  return jsonNoStore(c,{ok:true},200)
 } catch { return jsonNoStore(c,{error:'temporarily_unavailable'},503) }
}
