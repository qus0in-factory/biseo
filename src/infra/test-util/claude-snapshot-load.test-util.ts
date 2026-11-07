import assert from 'node:assert/strict'
import { claudeAfter429, claudeBackoffHit } from '../claude-oauth-gate.js'
import { chk } from './claude-cache-fixture.test-util.js'

const now = new Date('2026-10-30T10:30:00Z')
const r = claudeAfter429(now, 429, '0')
assert.equal(r.state, 'unknown')
assert.equal(r.metrics[0].used, 12)
assert.equal(r.checkedAt, chk)
assert.equal(r.windows[0].source, 'claude-stale')
assert.equal(claudeBackoffHit(new Date(now.getTime() + 1000))?.metrics[0].used, 12)
