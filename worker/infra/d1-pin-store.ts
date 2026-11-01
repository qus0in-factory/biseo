import type { D1Database } from '@cloudflare/workers-types'
import type { PinStore } from '../app/pin-ports.js'

export function createD1PinStore(db: D1Database): PinStore {
  return {
    async getHash() {
      const r = await db
        .prepare('SELECT pin_hash FROM auth_pin WHERE id=1')
        .first<{ pin_hash: string }>()
      return r?.pin_hash ?? null
    },
    async setHash(hash, actor, at) {
      await db
        .prepare(
          `INSERT INTO auth_pin(id,pin_hash,updated_at,updated_by) VALUES(1,?,?,?)
           ON CONFLICT(id) DO UPDATE SET pin_hash=excluded.pin_hash,
           updated_at=excluded.updated_at,updated_by=excluded.updated_by`,
        )
        .bind(hash, at, actor)
        .run()
    },
    async clear() {
      await db.prepare('DELETE FROM auth_pin WHERE id=1').run()
    },
  }
}
