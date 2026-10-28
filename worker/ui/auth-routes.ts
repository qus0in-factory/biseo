import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { DEFAULT_COOKIE_NAME, getCookieOptions } from './config.js'
import { handleLogin } from './login-handler.js'
import { verifySession } from './session.js'
import type { SessionBindings } from './types.js'

export function registerAuthRoutes(app: Hono<{ Bindings: SessionBindings }>) {
  app.post('/api/login', handleLogin)
  app.post('/api/logout', (c) => {
    const name = c.env.COOKIE_NAME || DEFAULT_COOKIE_NAME
    setCookie(c, name, '', getCookieOptions(c.env, 0))
    return c.json({ ok: true })
  })
  app.get('/api/session', async (c) => {
    const res = await verifySession(c)
    if (!res.ok) return c.json({ error: 'unauthorized' }, res.status)
    return c.json({ ok: true, subject: res.claims.sub })
  })
}
