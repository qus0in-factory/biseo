import type { Context } from 'hono'
import { login } from '../app/login.js'
import { checkRateLimit } from './rate-limit.js'
import { createLoginDeps, setSessionCookie } from './login-deps.js'
import type { SessionBindings } from './types.js'

export async function handleLogin(c: Context<{ Bindings: SessionBindings }>) {
  const rl = await checkRateLimit(c)
  if (rl === 'misconfigured') return c.json({ error: 'misconfigured' }, 500)
  if (rl === 'rate_limit_exceeded') return c.json({ error: 'rate_limit_exceeded' }, 429)
  const deps = await createLoginDeps(c.env)
  if (!deps) return c.json({ error: 'misconfigured' }, 500)
  const body = (await c.req.json().catch(() => null)) as { password?: unknown }
  const res = await login(deps, body?.password)
  if (!res.ok) return c.json({ error: 'unauthorized' }, 401)
  setSessionCookie(c, res.token)
  return c.json({ ok: true })
}
