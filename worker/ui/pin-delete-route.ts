import { createD1PinStore } from '../infra/d1-pin-store.js'
import { requireDb } from './storage-guard.js'
import { requireStrong } from './strong-session.js'
import { checkCsrf, jsonNoStore, type Ctx } from './timeline-guards.js'

export async function deletePin(c: Ctx) {
  const csrf = checkCsrf(c)
  if (csrf) return csrf
  const a = await requireStrong(c)
  if (!a.ok) return a.res
  const db = requireDb(c)
  if (!db.ok) return db.res
  await createD1PinStore(db.db).clear()
  await db.db.prepare('DELETE FROM pin_attempts').run()
  return jsonNoStore(c, { ok: true }, 200)
}
