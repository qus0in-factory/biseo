import type { Context } from 'hono'
import { setCookie } from 'hono/cookie'
import { login } from '../app/login.js'
import { createAdapters } from './adapters.js'
import { DEFAULT_COOKIE_NAME, getClaimPolicy, getCookieOptions } from './config.js'
import type { SessionBindings } from './types.js'

export async function handleLogin(c: Context<{ Bindings: SessionBindings }>) {
  const ad = await createAdapters(c.env)
  if (!ad) return c.json({ error: 'misconfigured' }, 500)
  const body = (await c.req.json().catch(() => null)) as { password?: unknown }
  const policy = getClaimPolicy(c.env)
  const deps = {
    verifier: ad.pwVerifier,
    signer: ad.signer,
    policy,
    storedVerifier: ad.storedVerifier,
    subject: c.env.SESSION_SUBJECT || 'owner',
  }
  const res = await login(deps, body?.password)
  if (!res.ok) return c.json({ error: 'unauthorized' }, 401)
  const name = c.env.COOKIE_NAME || DEFAULT_COOKIE_NAME
  setCookie(c, name, res.token, getCookieOptions(c.env))
  return c.json({ ok: true })
}
