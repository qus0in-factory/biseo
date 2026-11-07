import test from 'node:test'
import assert from 'node:assert/strict'
import { good, chk } from './test-util/claude-cache-fixture.test-util.js'
import { staleClaude } from './claude-snapshot-stale.js'
import { unknownUsage } from '../domain/usage-unknown.js'

test('each window expires independently, including missing reset times', () => {
  const u = { ...good, windows: [...good.windows,
    { ...good.windows[0], window: 'weekly', resetsAt: '2026-11-01T00:00:00Z' },
    { ...good.windows[0], window: 'missing', resetsAt: null }] }
  for (const reason of ['upstream_error', undefined]) {
    const r = staleClaude(u, unknownUsage('claude', reason), new Date('2026-10-30T12:00:00Z'))
    assert.equal(r.state, 'unknown')
    assert.equal(r.checkedAt, chk)
    assert.deepEqual(r.windows.map(w => w.window), ['weekly'])
    assert.deepEqual(r.metrics, [])
  }
})
