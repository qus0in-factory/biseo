import test from 'node:test'
import assert from 'node:assert/strict'
import { createApp } from './app.js'
import type { UsageCollector } from '../infra/usage-collector.js'

test('GET /herdr/usage requires service authentication and returns windows', async () => {
  const app = createApp({
    verify: async (token) => {
      if (token !== 'valid-token') {
        const err = new Error('unauthorized') as Error & { status: number }
        err.status = 401
        throw err
      }
    },
    healthStatus: 'ok',
    usageCollector: {
      getReport: async () => ({
        providers: [
          {
            provider: 'codex',
            state: 'available',
            windows: [
              {
                window: 'primary',
                usedPercent: 20,
                resetsAt: '2026-10-30T00:00:00.000Z',
                checkedAt: '2026-10-29T21:00:00.000Z',
                limitReached: false,
                source: 'codex',
              },
              {
                window: 'secondary',
                usedPercent: 90,
                resetsAt: '2026-11-05T00:00:00.000Z',
                checkedAt: '2026-10-29T21:00:00.000Z',
                limitReached: false,
                source: 'codex',
              },
            ],
          },
        ],
        updatedAt: '2026-10-29T21:00:00.000Z',
      }),
    } as unknown as UsageCollector,
  } as any)

  const unauth = await app.request('/herdr/usage')
  assert.equal(unauth.status, 401)

  const auth = await app.request('/herdr/usage', {
    headers: { Authorization: 'Bearer valid-token' },
  })
  assert.equal(auth.status, 200)
  const body = (await auth.json()) as any
  assert.equal(body.providers[0].provider, 'codex')
  assert.equal(body.providers[0].windows[0].usedPercent, 20)
  assert.equal(body.providers[0].windows[1].usedPercent, 90)
})
