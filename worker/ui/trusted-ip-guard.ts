import type { D1Database } from '@cloudflare/workers-types'
import { resolvePinRequest } from './pin-request.js'
import { requireDb } from './storage-guard.js'
import { requireStrong } from './strong-session.js'
import { checkCsrf, jsonNoStore, type Ctx } from './timeline-guards.js'

export async function trustedIpGuard(c: Ctx) {
  const csrf = checkCsrf(c)
  if (csrf) return { ok: false as const, res: csrf }
  const a = await requireStrong(c)
  if (!a.ok) return a
  const db = requireDb(c)
  if (!db.ok) return db
  const req = resolvePinRequest(c)
  if (!req) return { ok: false as const, res: jsonNoStore(c, { error: 'pin_unavailable' }, 403) }
  return { ok: true as const, actor: a.claims.sub, db: db.db as D1Database, ip: req.ip }
}
