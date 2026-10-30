import test from 'node:test'
import assert from 'node:assert/strict'
import http from 'node:http'
import { fetchGrokUsage } from './grok-billing-fetch.js'
import { setMemoryGrokToken } from './grok-token-refresh.js'
import { setLastGrokSnapshot } from './grok-snapshot-store.js'

test('fetchGrokUsage refreshes on expired token and succeeds', async () => {
  const prevUrl = process.env.BISEO_GROK_BILLING_URL
  const prevRef = process.env.BISEO_GROK_REFRESH_URL
  setMemoryGrokToken('expired-access-token')
  setLastGrokSnapshot(null)

  let billingCalls = 0
  let refreshCalls = 0
  const server = await startMockServer((req, res) => {
    if (req.url?.includes('/billing')) {
      billingCalls++
      if (req.headers.authorization === 'Bearer fresh-token') {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ creditUsagePercent: 30, billingPeriodEnd: '2026-11-05T00:00:00Z' }))
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'unauthorized' }))
      }
    } else if (req.url?.includes('/token')) {
      refreshCalls++
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ access_token: 'fresh-token' }))
    }
  })

  try {
    const addr = server.address() as any
    process.env.BISEO_GROK_BILLING_URL = `http://127.0.0.1:${addr.port}/billing`
    process.env.BISEO_GROK_REFRESH_URL = `http://127.0.0.1:${addr.port}/token`

    const res = await fetchGrokUsage(new Date('2026-10-30T10:00:00Z'))
    assert.equal(res.state, 'available')
    assert.equal(res.windows[0].usedPercent, 30)
    assert.equal(res.windows[0].source, 'grok')
    assert.equal(res.metrics[0].used, 30)
    assert.equal(refreshCalls, 1)
    assert.equal(billingCalls, 2)
  } finally {
    server.close()
    if (prevUrl) process.env.BISEO_GROK_BILLING_URL = prevUrl
    else delete process.env.BISEO_GROK_BILLING_URL
    if (prevRef) process.env.BISEO_GROK_REFRESH_URL = prevRef
    else delete process.env.BISEO_GROK_REFRESH_URL
  }
})

test('fetchGrokUsage returns stale snapshot when refresh fails', async () => {
  const prevUrl = process.env.BISEO_GROK_BILLING_URL
  const prevRef = process.env.BISEO_GROK_REFRESH_URL
  setMemoryGrokToken('expired-access-token')
  setLastGrokSnapshot({
    provider: 'grok',
    state: 'available',
    metrics: [{
      id: 'primary',
      label: 'primary',
      unit: 'percent',
      used: 45,
      limit: 100,
      remaining: 55,
      resetsAt: '2026-11-01T00:00:00Z'
    }],
    windows: [{
      window: 'primary',
      usedPercent: 45,
      resetsAt: '2026-11-01T00:00:00Z',
      checkedAt: '2026-10-30T09:00:00Z',
      limitReached: false,
      source: 'grok'
    }]
  })

  const server = await startMockServer((req, res) => {
    res.writeHead(401, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'failed' }))
  })

  try {
    const addr = server.address() as any
    process.env.BISEO_GROK_BILLING_URL = `http://127.0.0.1:${addr.port}/billing`
    process.env.BISEO_GROK_REFRESH_URL = `http://127.0.0.1:${addr.port}/token`

    const res = await fetchGrokUsage(new Date('2026-10-30T10:00:00Z'))
    assert.equal(res.state, 'available')
    assert.equal(res.windows[0].usedPercent, 45)
    assert.equal(res.windows[0].source, 'grok-stale')
    assert.equal(res.metrics[0].used, 45)
  } finally {
    server.close()
    if (prevUrl) process.env.BISEO_GROK_BILLING_URL = prevUrl
    else delete process.env.BISEO_GROK_BILLING_URL
    if (prevRef) process.env.BISEO_GROK_REFRESH_URL = prevRef
    else delete process.env.BISEO_GROK_REFRESH_URL
  }
})

function startMockServer(handler: (req: any, res: any) => void): Promise<http.Server> {
  const s = http.createServer(handler)
  return new Promise(resolve => s.listen(0, '127.0.0.1', () => resolve(s)))
}
