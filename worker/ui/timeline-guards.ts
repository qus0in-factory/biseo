import type { Context, Hono } from 'hono'
import { isOriginAllowed } from '../domain/origin-guard.js'
import { verifySession } from './session.js'
import type { SessionBindings } from './types.js'

export type App = Hono<{ Bindings: SessionBindings }>
export type Ctx = Context<{ Bindings: SessionBindings }>

export const jsonNoStore = (c: Ctx, b: unknown, s: number) =>
  c.json(b, s as any, { 'Cache-Control': 'no-store' })

export async function requireOwner(c: Ctx) {
  const r = await verifySession(c)
  const sub = c.env.SESSION_SUBJECT || 'owner'
  if (!r.ok || r.claims.sub !== sub) {
    return { ok: false as const, res: jsonNoStore(c, { error: 'unauthorized' }, r.ok ? 401 : r.status) }
  }
  return { ok: true as const, claims: r.claims }
}

export function checkCsrf(c: Ctx) {
  if (!isOriginAllowed(c.req.url, c.req.header('origin'), c.env.ALLOWED_ORIGINS)) {
    return jsonNoStore(c, { error: 'forbidden', reason: 'origin_not_allowed' }, 403)
  }
  return null
}
