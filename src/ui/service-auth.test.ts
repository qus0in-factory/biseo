import test from 'node:test'
import assert from 'node:assert/strict'
import { Hono } from 'hono'
import { ServiceAuthError } from '../app/verify-service.js'
import { serviceAuth } from './service-auth.js'
function appWith(verify: (t?: string) => Promise<void>) {
  const app = new Hono()
  app.use('/health', serviceAuth(verify))
  app.get('/health', (c) => c.json({ status: 'ok' }))
  return app
}
test('missing bearer maps to 401', async () => {
  const app = appWith(async () => {
    throw new ServiceAuthError(401)
  })
  const res = await app.request('/health')
  assert.equal(res.status, 401)
})
test('forbidden maps to 403 and success passes', async () => {
  const deny = appWith(async () => {
    throw new ServiceAuthError(403)
  })
  assert.equal((await deny.request('/health', { headers: { authorization: 'Bearer x' } })).status, 403)
  const ok = appWith(async () => {})
  const res = await ok.request('/health', { headers: { authorization: 'Bearer x' } })
  assert.equal(res.status, 200)
})
