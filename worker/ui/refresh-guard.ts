import type { Ctx } from './timeline-guards.js'
import { jsonNoStore } from './timeline-guards.js'

export function refreshGuard(c: Ctx) {
 const url = new URL(c.req.url)
 const hosts = (c.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim())
 if (url.protocol !== 'https:' || !hosts.includes(url.origin) ||
  c.req.header('origin') !== url.origin ||
  c.req.header('x-biseo-csrf') !== '1' ||
  c.req.header('sec-fetch-site') === 'cross-site') {
  return jsonNoStore(c, { error: 'forbidden' }, 403)
 }
 return null
}
