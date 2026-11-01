import { resolvePinRequest } from './pin-request.js'
import { createD1TrustedIp } from '../infra/d1-trusted-ip.js'
import type { Ctx } from './timeline-guards.js'

export async function allowPinRefresh(c: Ctx) {
 if (new URL(c.req.url).hostname !== 'biseo.qus0in.dev') return null
 const req = resolvePinRequest(c)
 return req && c.env.BISEO_DB && await createD1TrustedIp(c.env.BISEO_DB).has(req.ip) ? req.ip : null
}
