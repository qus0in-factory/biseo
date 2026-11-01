import { createD1PinStore } from '../infra/d1-pin-store.js'
import { createD1TrustedIp } from '../infra/d1-trusted-ip.js'
import { isPinCustomHost } from '../domain/pin-host.js'
import { resolvePinRequest } from './pin-request.js'
import { jsonNoStore, type Ctx } from './timeline-guards.js'

export async function pinPreferred(c: Ctx) {
  let preferred = false
  try {
    const db = c.env.BISEO_DB
    const req = isPinCustomHost(c.req.url) ? resolvePinRequest(c) : null
    if (db && req && (await createD1TrustedIp(db).has(req.ip))) {
      preferred = Boolean(await createD1PinStore(db).getHash())
    }
  } catch {
    preferred = false
  }
  return jsonNoStore(c, { pinPreferred: preferred }, 200)
}
