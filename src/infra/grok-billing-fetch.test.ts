import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { fetchGrokUsage } from './grok-billing-fetch.js'
import { initGrokMock, cleanGrokEnv } from './grok-mock-server.test-util.js'
import { mockGrokBilling } from './grok-mock-handler.test-util.js'
import { setLastGrokSnapshot } from './grok-snapshot-store.js'
import { initGrokMock, cleanGrokEnv, staleGrokUsage } from './grok-mock-server.test-util.js'

{

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
}
{

test('fetchGrokUsage returns stale snapshot when refresh fails', async () => {
  const s = http.createServer((_req, res) => {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'failed' }))
  })
  await new Promise(r => s.listen(0, '127.0.0.1', () => r(null)))
  initGrokMock((s.address() as any).port)
  setLastGrokSnapshot(staleGrokUsage)
  try {
    const res = await fetchGrokUsage(new Date('2026-10-30T10:00:00Z'))
    assert.equal(res.state, 'available')
    assert.equal(res.windows[0].source, 'grok-stale')
    assert.equal(res.metrics[0].used, 45)
  } finally {
    s.close()
    cleanGrokEnv()
  }
})
}
