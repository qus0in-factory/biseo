import test from 'node:test'
import assert from 'node:assert/strict'
import { good, chk } from './test-util/claude-cache-fixture.test-util.js'
import { resolveClaude, setLastClaudeSnapshot } from './claude-snapshot-store.js'
import { unknownUsage } from '../domain/usage-unknown.js'

test('failure retains the success time, unknown state and retryAt until reset', () => {
  setLastClaudeSnapshot(good)
  const fail = unknownUsage('claude', 'rate_limited', chk)
  const r = resolveClaude(new Date('2026-10-30T10:59:59Z'), fail)
  assert.equal(r.state, 'unknown')
  assert.equal(r.checkedAt, chk)
  assert.equal(r.retryAt, chk)
  assert.equal(r.windows[0].source, 'claude-stale')
  assert.equal(r.metrics[0].used, 12)
  assert.equal(resolveClaude(new Date('2026-10-30T11:00:00Z'), fail), fail)
  setLastClaudeSnapshot(null)
  assert.equal(resolveClaude(new Date(chk), fail), fail)
})
