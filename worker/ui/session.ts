import { getCookie } from 'hono/cookie'
import { validateClaims } from '../../shared/domain/validate.js'
import { createAdapters } from './adapters.js'
import { DEFAULT_COOKIE_NAME, getClaimPolicy } from './config.js'
import type { SessionBindings } from './types.js'

export async function verifySession(c: {
  req: { raw: Request }
  env: SessionBindings
}) {
  const adapters = await createAdapters(c.env)
  if (!adapters) return { ok: false as const, status: 500 as const }
  const cookieName = c.env.COOKIE_NAME || DEFAULT_COOKIE_NAME
  const token = getCookie(c as any, cookieName)
  if (!token) return { ok: false as const, status: 401 as const }
  try {
    const rawClaims = await adapters.verifier.verify(token)
    const policy = getClaimPolicy(c.env)
    const claims = validateClaims(policy, 'user-session', rawClaims)
    return { ok: true as const, claims }
  } catch {
    return { ok: false as const, status: 401 as const }
  }
}
