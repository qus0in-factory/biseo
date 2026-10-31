import { parseClientIp } from '../domain/client-ip.js'
import { jsonNoStore, requireOwner, type Ctx } from './timeline-guards.js'

export async function requireStrong(c: Ctx) {
  const a = await requireOwner(c)
  if (!a.ok) return a
  if (a.claims.auth === 'pin') {
    return { ok: false as const, res: jsonNoStore(c, { error: 'forbidden' }, 403) }
  }
  return a
}

export function currentIp(c: Ctx): string | null {
  return parseClientIp(c.req.header('cf-connecting-ip'))
}
