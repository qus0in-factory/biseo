import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from './app.js'
import { UsageCollector } from '../infra/usage-collector.js'

test('GET /herdr/usage requires service authentication', async () => {
  const app = createApp({
    verify: async (token) => {
      if (token !== 'valid-token') {
        const err = new Error('unauthorized') as Error & { status: number }
        err.status = 401
        throw err
      }
    },
    healthStatus: 'ok',
    usageCollector: new UsageCollector({
      get: async () => ({
        state: 'available',
        source: 'codex',
        checkedAt: null,
        observedAt: new Date().toISOString(),
        resetsAt: null,
        reason: null,
        window: null,
      }),
    }),
  } as any)

  const unauth = await app.request('/herdr/usage')
  assert.equal(unauth.status, 401)

  const auth = await app.request('/herdr/usage', {
    headers: { Authorization: 'Bearer valid-token' },
  })
  assert.equal(auth.status, 200)
  const body = (await auth.json()) as any
  assert.ok(Array.isArray(body.providers))
  assert.equal(body.providers[0].provider, 'codex')
  assert.equal(body.providers[0].state, 'available')
})
