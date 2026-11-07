import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { claudeAfter429 as hit } from './claude-oauth-gate.js'
import { claudeFloorMs as floorMs } from './claude-oauth-floor.js'
import { resetClaudeBackoff as reset } from './claude-oauth-backoff.js'
import { refreshClaudeUsage as refresh, resetClaudeRefresh as clear } from './claude-usage-refresh.js'

const t0 = new Date('2026-11-07T00:00:00.000Z')

test('429 repeats stay outside the floor', async () => {
  reset(); clear()
  let n = 0, done = (_v: unknown) => {}
  const load = () => new Promise(r => { n += 1; done = r })
  try {
    const floor = floorMs()
    const first = refresh(t0, load)
    done(hit(t0, 429, '0')); await first
    await refresh(new Date(+t0 + floor - 1), load)
    assert.equal(n, 1)
    const again = refresh(new Date(+t0 + floor), load)
    assert.equal(n, 2)
    done(hit(t0, 429, '0')); await again
  } finally { reset(); clear() }
})
