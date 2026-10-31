import type { D1Database } from '@cloudflare/workers-types'
import type { TrustedIpStore } from '../app/pin-ports.js'

export function createD1TrustedIp(db: D1Database): TrustedIpStore {
  return {
    async has(ip) {
      const r = await db
        .prepare('SELECT 1 AS ok FROM trusted_ips WHERE ip=?')
        .bind(ip)
        .first<{ ok: number }>()
      return !!r
    },
    async add(ip, actor, at) {
      await db
        .prepare(
          `INSERT INTO trusted_ips(ip,note,created_at,created_by) VALUES(?,?,?,?)
           ON CONFLICT(ip) DO NOTHING`,
        )
        .bind(ip, '', at, actor)
        .run()
    },
    async remove(ip) {
      await db.prepare('DELETE FROM trusted_ips WHERE ip=?').bind(ip).run()
    },
  }
}
