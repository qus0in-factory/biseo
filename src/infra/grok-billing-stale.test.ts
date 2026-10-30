import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { fetchGrokUsage } from './grok-billing-fetch.js'
import { setLastGrokSnapshot } from './grok-snapshot-store.js'
import { initGrokMock, cleanGrokEnv, staleGrokUsage } from './grok-mock-server.test-util.js'

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
