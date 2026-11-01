import test from 'node:test'
import assert from 'node:assert/strict'
import { Hono } from 'hono'
import { securityHeaders } from './security-headers.js'
import { SECURITY_HEADERS } from '../../shared/domain/security-headers.js'

test('the node app sends the shared security headers', async () => {
  const app = new Hono()
  app.use('*', securityHeaders)
  app.get('/health', (c) => c.json({ status: 'ok' }))
  const res = await app.request('http://127.0.0.1/health')
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
    assert.equal(res.headers.get(name), value, name)
  }
})
