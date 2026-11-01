import { isValidPin } from '../domain/pin-value.js'
import { createD1PinStore } from '../infra/d1-pin-store.js'
import { hashPin } from '../infra/pin-hash.js'
import { requireDb } from './storage-guard.js'
import { requireStrong } from './strong-session.js'
import { checkCsrf, jsonNoStore, type Ctx } from './timeline-guards.js'

export async function putPin(c: Ctx) {
  const csrf = checkCsrf(c)
  if (csrf) return csrf
  const a = await requireStrong(c)
  if (!a.ok) return a.res
  const db = requireDb(c)
  if (!db.ok) return db.res
  const body = (await c.req.json().catch(() => null)) as { pin?: unknown }
  if (!isValidPin(body?.pin)) return jsonNoStore(c, { error: 'invalid_pin' }, 400)
  const hash = await hashPin(body.pin, c.env.PIN_PEPPER || '')
  await createD1PinStore(db.db).setHash(hash, a.claims.sub, new Date().toISOString())
  await db.db.prepare('DELETE FROM pin_attempts').run()
  return jsonNoStore(c, { ok: true }, 200)
}
