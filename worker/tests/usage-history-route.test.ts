import test from 'node:test'
import assert from 'node:assert/strict'
import app from '../index.js'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { writeHistory } from '../infra/d1-usage-history-write.js'
import { historyPoint } from '../../shared/usage-history-fixture.js'

test('authenticated history API reports measured intervals without upstream requests', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const now = Date.now()
  await writeHistory(env.BISEO_DB, [historyPoint(now - 2, 10, 1),
    historyPoint(now - 1, 20, 3), historyPoint(now, 30, 5)], 0)
  const response = await app.fetch(new Request('http://localhost/api/usage/history/codex', {
    headers: { Cookie: cookie },
  }), env)
  assert.equal(response.status, 200)
  assert.equal((await response.json() as { ratio: number }).ratio, 0.2)
})
