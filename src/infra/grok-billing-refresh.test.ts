import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { fetchGrokUsage } from './grok-billing-fetch.js'
import { initGrokMock, cleanGrokEnv } from './grok-mock-server.test-util.js'
import { mockGrokBilling } from './grok-mock-handler.test-util.js'

test('fetchGrokUsage refreshes on expired token and succeeds', async () => {
  const b = { count: 0 }, r = { count: 0 }
  const s = http.createServer((req, res) => mockGrokBilling(req, res, b, r))
  await new Promise(done => s.listen(0, '127.0.0.1', () => done(null)))
  initGrokMock((s.address() as any).port)
  try {
    const res = await fetchGrokUsage(new Date('2026-10-30T10:00:00Z'))
    assert.equal(res.state, 'available')
    assert.equal(res.windows[0].usedPercent, 30)
    assert.equal(r.count, 1)
    assert.equal(b.count, 2)
  } finally {
    s.close()
    cleanGrokEnv()
  }
})
