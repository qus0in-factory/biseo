import { Hono } from 'hono'
import { handleRefresh } from './refresh-route.js'
import { handleLogout } from './logout-route.js'
import { handleLogin } from './login-handler.js'
import { verifySession } from './session.js'
import type { SessionBindings } from './types.js'

export function registerAuthRoutes(app: Hono<{ Bindings: SessionBindings }>) {
  app.post('/api/login', handleLogin)
  app.post('/api/refresh', handleRefresh)
  app.post('/api/logout', handleLogout)
  app.get('/api/session', async (c) => {
    c.header('Cache-Control', 'no-store')
    const res = await verifySession(c)
    if (!res.ok) return c.json({ error: 'unauthorized' }, res.status)
    return c.json({ ok: true, subject: res.claims.sub, expiresAt: res.claims.exp },
      200, { 'Cache-Control': 'no-store' })
  })
}
