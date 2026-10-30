import assert from 'node:assert/strict'
import test from 'node:test'
import app from '../index.js'
import { createTimelineTestEnv } from './timeline-helpers.js'
import { insertRow } from './d1-row.js'
import { delTurn } from './d1-requests.js'

test('DELETE persists cancellation and keeps remaining turns FIFO', async () => {
  const { env, cookie } = await createTimelineTestEnv()
  const db = env.BISEO_DB!
  for (const id of ['r1', 'r2', 'r3']) await insertRow(db, id, id)
  const orig = globalThis.fetch
  globalThis.fetch = (async () => Response.json({ requestId: 'r2', status: 'cancelled' })) as any
  try {
    const res = await app.fetch(delTurn('r2', cookie), env)
    assert.equal(res.status, 200)
    const rows = await db.prepare('SELECT request_id,status FROM timeline_turns ORDER BY seq').all()
    assert.deepEqual((rows.results as any[]).map((r) => [r.request_id, r.status]), [['r1', 'queued'], ['r2', 'cancelled'], ['r3', 'queued']])
  } finally { globalThis.fetch = orig }
})
