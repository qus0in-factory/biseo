import { startRefresh } from '../app/refresh-start.js'
import { refreshSource } from '../infra/refresh-source.js'
import { refreshPolicy } from './refresh-policy.js'
import { setRefreshCookie } from './refresh-cookie.js'
import { getPinConfig } from './pin-config.js'
import { setSessionCookie } from './login-deps.js'
import type { Ctx } from './timeline-guards.js'

export async function attachRefresh(c: Ctx, auth: 'password' | 'pin', access: string, ttl?: number) {
 const db = c.env.BISEO_DB
 if (!db) throw new Error('refresh storage unavailable')
 const r = await startRefresh(refreshSource(db),refreshPolicy(c.env),new URL(c.req.url).host,
  c.env.SESSION_SUBJECT || 'owner',auth,getPinConfig(c.env).sessionTtl)
 setSessionCookie(c,access,ttl)
 setRefreshCookie(c,r.token,r.age)
}
