import './test-util/claude-snapshot-env.test-util.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { refreshClaudeUsage as refresh, resetClaudeRefresh as clear } from './claude-usage-refresh.js'
import { resetClaudeBackoff as reset } from './claude-oauth-backoff.js'
import { claudeFloorMs as floorMs } from './claude-oauth-floor.js'
import { claudeAfter429 as hit } from './claude-oauth-gate.js'

test('retry-after 0 uses floor; concurrent refresh is one call', async () => {
  reset(); clear()
  const now = new Date('2026-11-07T00:00:00.000Z')
  assert.equal(Date.parse(hit(now, 429, '0').retryAt!) - +now, floorMs())
  assert.equal(floorMs('/missing.json', '120000'), 120_000)
  reset()
  let n = 0, done = (_v: unknown) => {}
  const load = () => new Promise(r => { n += 1; done = r })
  const a = refresh(now, load), b = refresh(now, load)
  assert.equal(n, 1)
  done({ provider: 'claude', state: 'unknown', metrics: [], windows: [] })
  await Promise.all([a, b])
  clear(); reset()
})
