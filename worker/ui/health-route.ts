import { Hono } from 'hono'
import ky, { TimeoutError } from 'ky'
import { createServiceToken } from '../infra/service-token.js'
import { verifySession } from './session.js'
import type { SessionBindings } from './types.js'

export function registerHealthRoute(app: Hono<{ Bindings: SessionBindings }>) {
  app.get('/api/health', async (c) => {
    const auth = await verifySession(c)
    if (!auth.ok) return c.json({ error: 'unauthorized' }, auth.status)
    const url = c.env.FUNNEL_HEALTH_URL
    const ms = Number(c.env.HEALTH_TIMEOUT_MS)
    const token = await createServiceToken(c.env)
    if (!url || !Number.isFinite(ms) || ms <= 0 || !token) {
      return c.json({ error: 'misconfigured' }, 502)
    }
    try {
      return c.json(await ky.get(url, { retry: 0, timeout: ms, headers: { Authorization: `Bearer ${token}` } }).json())
    } catch (e) {
      const t = e instanceof TimeoutError
      return c.json({ error: t ? 'timeout' : 'bad_gateway' }, t ? 504 : 502)
    }
  })
}
