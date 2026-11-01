import { currentRefresh } from '../app/refresh-current.js'
import { refreshSource } from '../infra/refresh-source.js'
import { allowPinRefresh } from './refresh-pin.js'
import { refreshAccess } from './refresh-access.js'
import { refreshPolicy } from './refresh-policy.js'
import type { Ctx } from './timeline-guards.js'

export async function executeRefresh(c: Ctx, token: string) {
 const d = refreshSource(c.env.BISEO_DB!)
 const now = Math.floor(Date.now()/1000)
 const r = await currentRefresh(d,token,new URL(c.req.url).host,now)
 if (!r) return null
 const ip = r.s.auth === 'pin' ? await allowPinRefresh(c) : ''
 if (ip === null) return null
 const access = await refreshAccess(c.env,r.s,now)
 const next = d.token()
 const idle = Math.min(r.s.expires,now+refreshPolicy(c.env).inactivity)
 if (!await d.rotate(r.s,r.hash,await d.hash(next),now,idle,ip)) return null
 return { ...access, next, remaining: r.s.expires-now }
}
