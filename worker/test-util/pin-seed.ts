import type { D1Database } from '@cloudflare/workers-types'
import { hashPin } from '../infra/pin-hash.js'

export async function seedTrusted(db: D1Database, ip: string) {
  await db
    .prepare('INSERT INTO trusted_ips(ip,note,created_at,created_by) VALUES(?,?,?,?)')
    .bind(ip, '', '2026-01-01T00:00:00.000Z', 'owner')
    .run()
}

export async function seedPin(db: D1Database, pin = '123456', pepper = '') {
  await db
    .prepare('INSERT INTO auth_pin(id,pin_hash,updated_at,updated_by) VALUES(1,?,?,?)')
    .bind(await hashPin(pin, pepper), '2026-01-01T00:00:00.000Z', 'owner')
    .run()
}
