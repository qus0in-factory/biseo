import test from 'node:test'
import assert from 'node:assert/strict'
import { createTimelineTestEnv } from '../test-util/timeline-helpers.js'
import { syncUsage } from '../scheduled-usage.js'
import { writeHistory } from '../infra/d1-usage-history-write.js'
import { readHistory } from '../infra/d1-usage-history-read.js'
import { historyPoint } from '../../shared/tests/support/usage-history-fixture.js'

test('failed upstream collection still cleans expired history', async t => {
  const { env } = await createTimelineTestEnv()
  await writeHistory(env.BISEO_DB, [historyPoint(1, 1, 1)], 0)
  t.mock.method(globalThis, 'fetch', async () => new Response('unavailable', { status: 503 }))
  assert.equal(await syncUsage(env.BISEO_DB, env), false)
  assert.equal((await readHistory(env.BISEO_DB, 'codex', 0)).length, 0)
})
