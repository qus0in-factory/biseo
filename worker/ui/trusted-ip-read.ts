import { createD1PinStore } from '../infra/d1-pin-store.js'
import { createD1TrustedIp } from '../infra/d1-trusted-ip.js'
import { resolvePinRequest } from './pin-request.js'
import { requireDb } from './storage-guard.js'
import { jsonNoStore, requireOwner, type Ctx } from './timeline-guards.js'

export async function trustedIpStatus(c: Ctx) {
  const a = await requireOwner(c)
  if (!a.ok) return a.res
  const db = requireDb(c)
  if (!db.ok) return db.res
  const req = resolvePinRequest(c)
  const trusted = req ? await createD1TrustedIp(db.db).has(req.ip) : false
  const pin = await createD1PinStore(db.db).getHash()
  return jsonNoStore(
    c,
    {
      ip: req?.ip ?? null,
      trusted,
      available: !!req,
      canManage: !!req && a.claims.auth !== 'pin',
      pinConfigured: !!pin,
    },
    200,
  )
}
